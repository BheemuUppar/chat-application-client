import { HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { finalize, Observable } from "rxjs";
import { LoaderService } from "../services/loader.service";


@Injectable()
export class AppHttpInterceptor implements HttpInterceptor{
    
    constructor(private loadingService:LoaderService){

    }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        this.loadingService.showLoader();

    // Hide the loader when the request completes or fails
    return next.handle(req).pipe(
      finalize(() => this.loadingService.hideLoader())  // Hide the loader after request completes
    );
    }
    
}