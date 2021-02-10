import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {PolymerElement} from '@vaadin/angular2-polymer';

import {AppComponent} from './app.component';
import {PdbService} from './app.service';
import {KeysPipe} from './json.pipe';

@NgModule({
    declarations: [
        AppComponent,
        KeysPipe
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule
    ],
    providers: [PdbService],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
}
