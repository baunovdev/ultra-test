import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-loading-dots',
    templateUrl: './loading-dots.component.html',
    styleUrls: ['./loading-dots.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingDotsComponent implements OnInit {
    @Input() type: 'ripple' | 'circles' = 'circles';

    constructor() {}

    ngOnInit(): void {}
}
