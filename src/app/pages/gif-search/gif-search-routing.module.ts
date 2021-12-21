import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GifSearchComponent } from './gif-search.component';

const routes: Routes = [
    {
        path: '',
        component: GifSearchComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class GifSearchRoutingModule {}
