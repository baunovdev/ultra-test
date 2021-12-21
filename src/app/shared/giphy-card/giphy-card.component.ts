import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Input,
    OnInit,
    ViewChild,
} from '@angular/core';

@Component({
    selector: 'app-giphy-card',
    templateUrl: './giphy-card.component.html',
    styleUrls: ['./giphy-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GiphyCardComponent implements OnInit {
    @ViewChild('container') containerRef: ElementRef<HTMLDivElement> | undefined;

    @Input() set imgSrc(src: string | undefined) {
        if (!src) {
            return;
        }
        this._imgSrc = src;
        this.mainLoaded = false;
        const img = new Image();
        img.onload = () => {
            this.mainLoaded = true;
            this.cd.markForCheck();
        };
        img.src = src;
    }
    _imgSrc: string | undefined;
    @Input() title: string | undefined;
    @Input() set previewImgSrc(src: string | undefined) {
        if (!src) {
            return;
        }
        this._previewImgSrc = src;
        this.previewLoaded = false;
    }
    _previewImgSrc: string | undefined;

    mainLoaded = false;
    previewLoaded = false;
    constructor(private readonly cd: ChangeDetectorRef) {}

    ngOnInit(): void {}

    onPreviewLoaded(): void {
        this.previewLoaded = true;
    }

    private getBgColor(img: HTMLImageElement): string {
        const canvas = document.createElement('canvas');
        const ctx: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D;
        ctx.drawImage(img, 0, 0, img.naturalWidth / 20, img.naturalHeight / 20, 0, 0, 1, 1);
        const data = ctx.getImageData(0, 0, 1, 1).data;
        return `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${data[3] / 255})`;
    }
}
