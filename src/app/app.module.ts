import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AppComponent } from "./app.component";
import * as Components from "../components/index";

function declarations () {
  const components = [AppComponent];
  // for (const component in Components) {
  //   if (Components.hasOwnProperty(component)) {
  //       components.push(Components[component]);
  //   }
  // }
  return components;
}

@NgModule({
  declarations: [AppComponent, Components.TronComponent], // declarations(),
  imports: [
    BrowserModule
  ],
  entryComponents: [AppComponent, Components.TronComponent], // declarations(),
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
