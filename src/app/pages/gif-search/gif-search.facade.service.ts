import { Injectable } from '@angular/core';
import {
    BehaviorSubject,
    debounceTime,
    distinctUntilChanged,
    map,
    Observable,
    shareReplay,
    startWith,
    switchMap,
    tap,
    combineLatest,
    of,
    withLatestFrom,
    pluck,
} from 'rxjs';
import { GiphyService } from '../../giphy/giphy.service';
import { GiphyDisplayItem } from '../../models/giphy-display-item';
import { MultiResponse } from 'giphy-api';

export const PAGE_SIZE = 9;
export const MAX_TOTAL_COUNT = 4999;
export const MAX_TRENDING_COUNT = 175 * PAGE_SIZE;

export interface SearchParams {
    search: string[];
    page: number;
}

@Injectable()
export class GifSearchFacadeService {
    private readonly searchParamsSubj$ = new BehaviorSubject<SearchParams>({ search: [], page: 1 });
    private readonly searchTermSubj$ = new BehaviorSubject<string>('');
    public readonly searchTerm$ = this.searchTermSubj$.asObservable();

    private readonly giphySearchResponse$: Observable<MultiResponse> = this.searchParamsSubj$
        .pipe(
            map((params) => {
                return {
                    search: params.search.join(' '),
                    page: params.page,
                };
            })
        )
        .pipe(
            debounceTime(10),
            switchMap(({ search, page }) => {
                return this.giphyService.search({ q: search, limit: PAGE_SIZE, offset: (page - 1) * PAGE_SIZE });
            }),
            tap(() => this.itemsLoadingSubj$.next(false)),
            shareReplay(1)
        );

    public readonly items$: Observable<GiphyDisplayItem[]> = this.giphySearchResponse$.pipe(
        map((resp) => {
            const pageAr = new Array(PAGE_SIZE).fill(null);
            resp.data.forEach((imgData, index) => {
                pageAr[index] = {
                    imgSrc: imgData.images.fixed_height.webp,
                    title: imgData.title,
                    previewSrc: imgData.images.fixed_height_small_still.url,
                };
            });
            return pageAr;
        }),
        startWith(new Array(PAGE_SIZE).fill(null))
    );

    public readonly itemsCount$: Observable<number> = this.giphySearchResponse$.pipe(
        withLatestFrom(this.searchParamsSubj$.pipe(pluck('search'))),
        map(([resp, tags]) => {
            if (!tags?.length) {
                return Math.min(resp.pagination.total_count, MAX_TRENDING_COUNT);
            }
            return Math.min(resp.pagination.total_count, MAX_TOTAL_COUNT);
        })
    );

    public readonly autocompleteOptions$: Observable<string[]> = combineLatest([
        this.searchTermSubj$.pipe(startWith('')),
        this.searchTermSubj$.pipe(
            distinctUntilChanged(),
            debounceTime(100),
            switchMap((search: string) => {
                if (!search) {
                    return of([]);
                }
                return this.giphyService.autocomplete({ q: search }).pipe(
                    map((resp) => {
                        return resp.data.map((tag) => tag.name);
                    })
                );
            }),
            startWith([])
        ),
    ]).pipe(
        map(([term, options]) => {
            if (!options?.length) {
                return term ? [term] : [];
            }
            return Array.from(new Set([term, ...options]));
        }),
        shareReplay(1)
    );

    private readonly itemsLoadingSubj$ = new BehaviorSubject<boolean>(false);
    public readonly itemsLoading$ = this.itemsLoadingSubj$.asObservable();

    constructor(private readonly giphyService: GiphyService) {}

    public search(params: SearchParams): void {
        this.itemsLoadingSubj$.next(true);
        this.searchParamsSubj$.next(params);
    }

    public autocomplete(search: string): void {
        this.searchTermSubj$.next(search);
    }
}
