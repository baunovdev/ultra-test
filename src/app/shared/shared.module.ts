import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GiphyCardComponent } from './giphy-card/giphy-card.component';
import { LoadingDotsComponent } from './loading-dots/loading-dots.component';
import { LoadingBarComponent } from './loading-bar/loading-bar.component';

@NgModule({
    declarations: [GiphyCardComponent, LoadingDotsComponent, LoadingBarComponent],
    exports: [GiphyCardComponent, LoadingDotsComponent, LoadingBarComponent],
    imports: [CommonModule],
})
export class SharedModule {}
