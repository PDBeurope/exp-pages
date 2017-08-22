import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class PdbService{

    constructor(private http: Http) {}

    getApiData(entryid: string, apiurl: string): Promise<any>{
        let ApiUrl = apiurl+entryid;
        return this.http.get(ApiUrl)
            .toPromise()
            .then(response => response.json() as any)
            .catch(this.handleError);
    }

    private handleError(error: any): void {
        console.log("Note: This entry does not have related data at the URL above");
    }
}