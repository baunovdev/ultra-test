import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { GiphyService } from '../../giphy/giphy.service';
import { map, Observable, pluck, shareReplay } from 'rxjs';
import { GiphyDisplayItem } from '../../models/giphy-display-item';
import { ActivatedRoute, Router } from '@angular/router';
import { GifSearchFacadeService, SearchParams } from './gif-search.facade.service';
import { NgSelectComponent } from '@ng-select/ng-select';

function getPageParam(pageStr: string | null): number {
    console.log('getPageParam', pageStr);
    if (!pageStr) {
        return 1;
    }
    try {
        return parseInt(pageStr);
    } catch {
        return 1;
    }
}

@Component({
    selector: 'app-gif-search',
    templateUrl: './gif-search.component.html',
    styleUrls: ['./gif-search.component.scss'],
    providers: [GifSearchFacadeService],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GifSearchComponent implements OnInit {
    @ViewChild('searchBox', { static: true }) searchBox: NgSelectComponent | undefined;

    private readonly searchParams$: Observable<SearchParams> = this.route.queryParamMap.pipe(
        map((params) => {
            const searchParam = params.get('search') ?? null;
            const pageParam = params.get('page') ?? null;
            return {
                search: searchParam ? searchParam.split(',') : [],
                page: getPageParam(pageParam),
            };
        }),
        shareReplay(1)
    );

    readonly page$: Observable<number> = this.searchParams$.pipe(pluck('page'));
    readonly selectedTags$: Observable<string[]> = this.searchParams$.pipe(pluck('search'));
    readonly tagsOptions$: Observable<string[]> = this.gifSearchService.autocompleteOptions$;
    readonly itemsCount$: Observable<number> = this.gifSearchService.itemsCount$;
    readonly items$: Observable<GiphyDisplayItem[]> = this.gifSearchService.items$;
    readonly loading$: Observable<boolean> = this.gifSearchService.itemsLoading$;

    addTagFn = (term: string) => term;
    trackByFn = (index: number, item: GiphyDisplayItem) => item?.imgSrc;

    constructor(
        private readonly giphyService: GiphyService,
        private readonly gifSearchService: GifSearchFacadeService,
        private readonly router: Router,
        private readonly route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.searchParams$.subscribe((params) => {
            this.gifSearchService.search(params);
        });
    }

    onTagsAutocomplete(term: string): void {
        this.gifSearchService.autocomplete(term);
    }

    onTagsChange(tags: string[]): void {
        this.router.navigate([], {
            queryParams: {
                search: tags.length ? tags.join(',') : undefined,
                page: 1,
            },
        });
    }

    onPageChange(page: number): void {
        this.router.navigate([], {
            queryParams: {
                page,
            },
            queryParamsHandling: 'merge',
        });
    }
}
