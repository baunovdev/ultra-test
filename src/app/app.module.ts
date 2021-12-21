import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GiphyModule } from './giphy/giphy.module';
import { environment } from '../environments/environment';

@NgModule({
    declarations: [AppComponent],
    imports: [BrowserModule, AppRoutingModule, NgbModule, GiphyModule.forRoot(environment.giphyApiKey)],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
