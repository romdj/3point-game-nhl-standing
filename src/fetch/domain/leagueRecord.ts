import { WinType } from "./wintype";

export class LeagueRecord {
    regulationWin: number = 0;
    regulationLoss: number = 0;
    overtimeWin: number = 0;
    overtimeLoss: number = 0;
    shootoutWin: number = 0;
    shootoutLoss: number = 0;

    constructor() {
    }

    addRecord = (win: boolean, winType: WinType) => {
        if (win) {
            switch (winType) {
                case WinType.REGULATION:
                    this.addRegulationWin;
                    return;
                case WinType.OVERTIME:
                    this.addOvertimeWin;
                    return;
                case WinType.SHOOTOUT:
                    this.addShootoutWin;
                    return;
            }
        }
        switch (winType) {
            case WinType.REGULATION:
                this.addRegulationLoss;
                return;
            case WinType.OVERTIME:
                this.addOvertimeLoss;
                return;
            case WinType.SHOOTOUT:
                this.addShootoutLoss;
                return;
        }
    }


    addRegulationWin = () => { this.regulationWin = this.regulationWin + 1; };
    addRegulationLoss = () => { this.regulationLoss = this.regulationLoss + 1; };
    addOvertimeWin = () => { this.overtimeWin = this.overtimeWin + 1; };
    addOvertimeLoss = () => { this.overtimeLoss = this.overtimeLoss + 1; };
    addShootoutWin = () => { this.shootoutWin = this.shootoutWin + 1; };
    addShootoutLoss = () => { this.shootoutLoss = this.shootoutLoss + 1; };

    getPoints = () => {
        return this.regulationWin * 3 + this.overtimeWin * 2 + this.shootoutWin * 2 + this.overtimeLoss + this.shootoutLoss;
    }
}