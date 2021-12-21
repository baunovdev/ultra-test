import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-loading-bar',
    templateUrl: './loading-bar.component.html',
    styleUrls: ['./loading-bar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingBarComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}
}
