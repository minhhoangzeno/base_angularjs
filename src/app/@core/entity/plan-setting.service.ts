import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { HttpService } from '../backend/common/api/http.service';
import { PlanSetting } from '../interfaces/business/plan-setting';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PlanSettingService {
    private readonly apiController: string = 'explorer/plan-setting';
    constructor(private readonly api: HttpService) { }

    getSetting(planRef: string): Observable<PlanSetting> {
        return this.api.get(`${this.apiController}/get-setting`, { params: { planRef: planRef } });
    }

    addDisplayedScenario(planRef: string, scenarioId: string): Observable<PlanSetting> {
        return this.api.post(`${this.apiController}/add-scenario`, { planRef: planRef, scenarioId: scenarioId });
    }

    hideDisplayedScenario(planRef: string, scenarioId: string): Observable<PlanSetting> {
        return this.api.post(`${this.apiController}/hide-scenario`, { planRef: planRef, scenarioId: scenarioId });
    }

    deleteDisplayedScenario(planRef: string, scenarioId: string): Observable<PlanSetting> {
        return this.api.post(`${this.apiController}/delete-scenario`, { planRef: planRef, scenarioId: scenarioId });
    }

    changeDisplayedScenario(planRef: string, scenarios: string[]): Observable<PlanSetting> {
        return this.api.post(`${this.apiController}/change-scenario`, { planRef: planRef, scenarios: scenarios });
    }
}
