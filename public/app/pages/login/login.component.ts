import {Component} from 'angular2/core'
import {Router} from 'angular2/router'
import {UserStoreService} from '../../common/services/userStore.service';
import {ApiService} from '../../common/services/api.service';


@Component({
    selector: 'login',
    templateUrl:  'app/pages/login/login.html'
})

export class LoginComponent {
    constructor(
        private _router: Router,
        private _userStore: UserStoreService,
        private _api: ApiService
    ) {}

    public username: string;
    public password: string;
    public error: string;
    public submitted = false;

    onSubmit() {
        this.submitted = true;
        this._api.send('login', {username: this.username, password: this.password}).subscribe(
            res => {
                // Remove success so we don't store it in local
                delete res['success'];
                // Store the user data in local storage
                this._userStore.setUser(res);
                this._router.navigate(['Dashboard'])
            },

            err => {
                this.error = err;
                this.submitted = false;
            }
        )
    }
}