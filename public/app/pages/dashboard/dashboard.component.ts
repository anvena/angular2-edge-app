import {Component, Injector} from '@angular/core'
import {ROUTER_DIRECTIVES, Routes, CanActivate, Router} from '@angular/router'
import {UserStoreService} from '../../common/services/userStore.service'
import {appInjector} from '../../common/config/app.injector'
import {RoomComponent} from './room/room.component'
import {DashboardMainComponent} from './main/dashboardMain.component'
import {DataService} from '../../common/services/data.service'
import {SocketControlService} from '../../common/services/socketControl.service'
import {UserBlockComponent} from '../../common/components/userBlock/userBlock.component'

@CanActivate(() => {
    let injector: Injector = appInjector(),
        router: Router = injector.get(Router),
        userStore: UserStoreService = injector.get(UserStoreService),
        data: DataService = injector.get(DataService),
        user = userStore.getUser();

    if (user) {
        return data.getAllData()
            .catch(err => false)
            .then(res => true)
    }

    router.navigate(['/login']);
    return false;

})

@Component({
    selector: 'user',
    templateUrl: 'app/pages/dashboard/dashboard.html',
    providers: [SocketControlService],
    directives: [
        ROUTER_DIRECTIVES,
        UserBlockComponent
    ]
})

@Routes([
    {path: '/', component: DashboardMainComponent},
    {path: '/:name', component: RoomComponent},

    // Catch All route
    {path: '*', component: DashboardMainComponent}
])

export class DashboardComponent {
    constructor(
        private _socketControl: SocketControlService,
        private _data: DataService
    ) {
        // Validate the socket connetion and start listening to client emits
        _socketControl.validateAndOpenListeners();
        this.users = _data.users;
    }

    public users;
}