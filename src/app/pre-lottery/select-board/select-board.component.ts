import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { LoaderComponent } from "src/app/loader/loader.component";
import { BoardModel } from "../models/board.model";
import {
  api_url,
  PreLotteryApplicationService,
} from "../services/pre-lottery-application.service";
import { ActivatedRoute, Params, Router } from "@angular/router";

@Component({
  selector: "app-select-board",
  templateUrl: "./select-board.component.html",
  styleUrls: ["../pre-lottery.component.scss"],
})
export class SelectBoardComponent implements OnInit {
  boards: BoardModel[] = [];
  api_url: string = "";
  loaded: boolean = false;
  progressSpinnerDialog: any = null;
  counter: number = 0;
  mode: string;

  constructor(
    private route: ActivatedRoute,
    private preLotteryApplicationService: PreLotteryApplicationService,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.api_url = api_url;
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.mode = params["mode"];
      console.log("mode data", this.mode);

      if (!this.mode) {
        this.loadData();
      } else {
        this.loadViewData();
      }
    });
  }

  loadData() {
    this.displayProgressSpinner();

    this.preLotteryApplicationService.fetchBoardsForApplying().subscribe(
      (data) => {
        this.progressSpinnerDialog.close();
        if (data.status === "SUCCESS") {
          this.boards = data.boards;
          this.loaded = true;
        } else {
          this.preLotteryApplicationService.showErrorToast(data.errorMessage);
        }
      },
      async (error) => {
        this.progressSpinnerDialog.close();
        if (this.counter < 1) {
          this.counter++;
          this.preLotteryApplicationService
            .checkErrorForExpiredToken(error, "error-select-board-load")
            .then((num) => {
              this.loadData();
            });
        }
      }
    );
  }

  loadViewData() {
    this.displayProgressSpinner();

    this.preLotteryApplicationService.fetchActiveBoards().subscribe(
      (data) => {
        this.progressSpinnerDialog.close();
        if (data.status === "SUCCESS") {
          this.boards = data.boards;
          this.loaded = true;
        } else {
          this.preLotteryApplicationService.showErrorToast(data.errorMessage);
        }
      },
      async (error) => {
        this.progressSpinnerDialog.close();
        if (this.counter < 1) {
          this.counter++;
          this.preLotteryApplicationService
            .checkErrorForExpiredToken(error, "error-select-board-load")
            .then((num) => {
              this.loadData();
            });
        }
      }
    );
  }

  async displayProgressSpinner() {
    this.progressSpinnerDialog = this.dialog.open(LoaderComponent, {
      disableClose: true,
      panelClass: "progressSpinner",
    });
  }

  onBoardClick(b: BoardModel) {
    if (this.mode) {
      if (b.showBoardDocuments) {
        this.router.navigate(
          ["/app", "board-documents", b.key, this.mode],
          { replaceUrl: true }
        );
      } else if (b.boardType === "FCFS") {
        const fcfsUrl = "lottery.mhada.gov.in/OnlineLottery";

        window.open(b.fcfsUrl, "_blank");
      } else {
        this.router.navigate(
          ["/app", "select-lottery", b.key, this.mode],
          { replaceUrl: true }
        );
      }
    } else {
      if (b.showBoardDocuments) {
        this.router.navigate(
          ["/app", "board-documents", b.key, "APPLY"],
          { replaceUrl: true }
        );
      } else if (b.boardType === "FCFS") {
        const fcfsUrl = "lottery.mhada.gov.in/OnlineLottery";
        window.open(b.fcfsUrl, "_blank");
      } else {
        this.router.navigate(["/app", "select-lottery", b.key], {
          replaceUrl: true,
        });
      }
    }
  }
}
