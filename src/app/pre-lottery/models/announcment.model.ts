export class AnnouncementModel {
    constructor(
        public announcementKey: number, public announcementEn: string, 
	    public announcementMr: string, public externalLink: string,
	    public imageName: string, public fileName: string,
        public announcementType: string, public displaySequence: number,
	    public boardKey: number, public boardCode: string
    ) { }
}