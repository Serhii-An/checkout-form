import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CheckoutFormComponent } from './checkout-form/checkout-form.component';
import { ShowErrorComponent } from './checkout-form/show-error/show-error.component';
import { SelectboxCustomComponent } from './checkout-form/selectbox-custom/selectbox-custom.component';

@NgModule({
  declarations: [
    AppComponent,
    CheckoutFormComponent,
    ShowErrorComponent,
    SelectboxCustomComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
