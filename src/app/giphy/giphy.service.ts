import { Inject, Injectable } from '@angular/core';
import { GIPHY_API_KEY } from './giphy-api-key.token';
import { HttpClient } from '@angular/common/http';
import { MultiResponse, SearchOptions } from 'giphy-api';
import { Observable } from 'rxjs';

const ROOT_GIFS_URL = 'https://api.giphy.com/v1/gifs';

interface GiphyTag {
    name: string;
}

export interface GiphyResponse<T> {
    data: T[];
    meta: {
        status: number;
        msg: string;
        response_id: string;
    };
}

@Injectable()
export class GiphyService {
    constructor(@Inject(GIPHY_API_KEY) private readonly apiKey: string, private readonly http: HttpClient) {}

    public search({ q = '', limit = 10, offset = 0, rating = 'g' }: Partial<SearchOptions>): Observable<MultiResponse> {
        if (!q) {
            return this.trending({ limit, offset, rating });
        }
        return this.http.get<MultiResponse>(`${ROOT_GIFS_URL}/search`, {
            observe: 'body',
            responseType: 'json',
            params: {
                api_key: this.apiKey,
                limit,
                q,
                offset,
                rating,
            },
        });
    }

    public trending({ limit = 10, offset = 0, rating = 'g' }: Partial<SearchOptions>): Observable<MultiResponse> {
        return this.http.get<MultiResponse>(`${ROOT_GIFS_URL}/trending`, {
            observe: 'body',
            responseType: 'json',
            params: {
                api_key: this.apiKey,
                limit,
                offset,
                rating,
            },
        });
    }

    public autocomplete({
        q = '',
        limit = 10,
        offset = 0,
    }: Partial<SearchOptions>): Observable<GiphyResponse<GiphyTag>> {
        return this.http.get<GiphyResponse<GiphyTag>>(`${ROOT_GIFS_URL}/search/tags`, {
            observe: 'body',
            responseType: 'json',
            params: {
                api_key: this.apiKey,
                limit,
                q,
                offset,
            },
        });
    }
}
