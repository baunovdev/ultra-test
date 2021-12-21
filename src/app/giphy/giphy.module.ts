import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GIPHY_API_KEY } from './giphy-api-key.token';
import { GiphyService } from './giphy.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
    declarations: [],
    imports: [HttpClientModule, CommonModule],
})
export class GiphyModule {
    static forRoot(apiKey: string): ModuleWithProviders<GiphyModule> {
        return {
            ngModule: GiphyModule,
            providers: [GiphyService, { provide: GIPHY_API_KEY, useValue: apiKey }],
        };
    }
}
