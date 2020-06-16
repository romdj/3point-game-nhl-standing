import { WinType } from "./wintype";

export class LeagueRecord {
    regulationWin: number;
    regulationLoss: number;
    overtimeWin: number;
    overtimeLoss: number;
    shootoutWin: number;
    shootoutLoss: number;
    points: number;

    constructor() {
        this.regulationWin = 0;
        this.regulationLoss = 0;
        this.overtimeWin = 0;
        this.overtimeLoss = 0;
        this.shootoutWin = 0;
        this.shootoutLoss = 0;
        this.points = 0;
        this.updatePoints();
    }

    addRecord = (win: boolean, winType: WinType) => {
        if (win) {
            switch (winType) {
                case WinType.REGULATION:
                    this.addRegulationWin();
                    break;
                case WinType.OVERTIME:
                    this.addOvertimeWin();
                    break;
                case WinType.SHOOTOUT:
                    this.addShootoutWin();
                    break;
            }
        } else {
            switch (winType) {
                case WinType.REGULATION:
                    this.addRegulationLoss();
                    break;
                case WinType.OVERTIME:
                    this.addOvertimeLoss();
                    break;
                case WinType.SHOOTOUT:
                    this.addShootoutLoss();
                    break;
            }
        }
        this.updatePoints();
    }

    private addRegulationWin = () => { this.regulationWin += 1; };
    private addRegulationLoss = () => { this.regulationLoss += 1; };
    private addOvertimeWin = () => { this.overtimeWin += 1; };
    private addOvertimeLoss = () => { this.overtimeLoss += 1; };
    private addShootoutWin = () => { this.shootoutWin += 1; };
    private addShootoutLoss = () => { this.shootoutLoss += 1; };

    updatePoints = () => {
        this.points = this.getPoints();
    }
    getPoints = (): number => {
        return this.regulationWin * 3 + this.overtimeWin * 2 + this.shootoutWin * 2 + this.overtimeLoss + this.shootoutLoss;
    }
}