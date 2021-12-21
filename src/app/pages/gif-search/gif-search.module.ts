import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GifSearchComponent } from './gif-search.component';
import { GifSearchRoutingModule } from './gif-search-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    declarations: [GifSearchComponent],
    imports: [CommonModule, GifSearchRoutingModule, SharedModule, FormsModule, NgSelectModule, NgbPaginationModule],
})
export class GifSearchModule {}
