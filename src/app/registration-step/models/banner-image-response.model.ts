import { BannerImageModel } from "./banner-image.model";

export class BannerImageResponse {
    constructor(
        public bannerImages: BannerImageModel[],
        public status: string, 
        public errorMessage: string
    ) { }
}