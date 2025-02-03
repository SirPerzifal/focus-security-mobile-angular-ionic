import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from '../../api.service';

@Injectable({
  providedIn: 'root'
})
export class RaiseARequestService extends ApiService  {
  private apiUrl = this.baseUrl + '/resident/get/expected_visitor';
  private postApiUrlOvernight = this.baseUrl + '/resident/post/overnight_parking_application';

  constructor(http: HttpClient) { 
    super(http);
  }

  getExpectedVisitors(unitId: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  
    const body = {
      jsonrpc: '2.0',
      params: {
        unit_id: unitId,
      }
    };

    // Change to send data in request body
    return this.http.post(`${this.apiUrl}`, body, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  postOvernightFormCar(
    blockId: number,
    unitId: number,
    contactNumber: number,
    applicantType: string,
    vehicleNumber: string | null,
    visitorId: number | null,
    purpose: string | null,
    rentalAggrement: string | null,
    familyId: number | null,
  ): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    });
  
    const body = {
      jsonrpc: '2.0',
      params: {
        block: blockId,
        unit: unitId,
        contact_number: contactNumber,
        applicant_type: applicantType,
        vehicle_number: vehicleNumber,
        visitor_id: visitorId,
        purpose: purpose,
        rental_agreement: rentalAggrement,
        family_id: familyId,
      },
    };
  
    return this.http.post(`${this.postApiUrlOvernight}`, body, { headers }).pipe(
      catchError(this.handleError)
    );
  }  

  // API moveinout methods
  private postApiReqSchedule = this.baseUrl + '/resident/post/request_schedule_permit';
  postSchedule(
    scheduleDate?: string,
    requestorId?: string,
    scheduleType?: string,
    blockId?: number,
    unitId?: number,
    contact_person_id?: string,
    requestor_signature?: string,
    contractor_contact_person?: string, 
    contractor_contact_number?: string,
    contractor_company_name?: string,
    contractor_vehicle_number?: string
  ): Observable<any> {
    const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    });

    const body = {
        jsonrpc: '2.0',
        params: {
            schedule_date: scheduleDate,
            requestor_id: requestorId,
            schedule_type: scheduleType,
            block_id: blockId,
            unit_id: unitId,
            contact_person_id: contact_person_id,
            requestor_signature: requestor_signature,
            contractor_contact_person: contractor_contact_person,
            contractor_contact_number: contractor_contact_number,
            contractor_company_name: contractor_company_name,
            contractor_vehicle_number: contractor_vehicle_number
        },
    };

    return this.http.post(`${this.postApiReqSchedule}`, body, { headers }).pipe(
        catchError(this.handleError)
    );
  }

  // Bicycle API methods
  private postApiBicycle = this.baseUrl + '/resident/post/request_bicycle_tag';
  private getApiBicycle = this.baseUrl + '/residential/get/bicycle_tag_based_on_unit';
  postRequestBicycle(
    block_id: number,
    unit_id: number,
    bicycle_brand: string,
    bicycle_colour: string,
    bicycle_id?: number, // Optional untuk replacement
    bicycle_image?: string, // Optional untuk new application
  ): Observable<any> {
    const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    });
  
    const body = {
        jsonrpc: '2.0',
        params: {
          block_id: block_id,
          unit_id: unit_id,
          bicycle_brand: bicycle_brand,
          bicycle_colour: bicycle_colour,
          bicycle_image: bicycle_image, // Hanya akan ada untuk new application
          bicycle_tag_id: bicycle_id, // Hanya akan ada untuk replacement
        },
    };
  
    return this.http.post(`${this.postApiBicycle}`, body, { headers }).pipe(
        catchError(this.handleError)
    );
  }

  getBicycletag(
    unit_id: number,
  ): Observable<any> {
    const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    });

    const body = {
        jsonrpc: '2.0',
        params: {
          unit_id: unit_id,
        },
    };

    return this.http.post(`${this.getApiBicycle}`, body, { headers }).pipe(
        catchError(this.handleError)
    );
  }

  // Appclication card API methods
  private postApiCard = this.baseUrl + '/resident/post/request_access_card';
  private getApiCard = this.baseUrl + '/residential/get/access_card_family_member_data';
  postRequestCard(
    family_id: number,
    access_card_replacement_id?: number,
    reason_for_replacement?: string
  ): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    });

    const body = {
        jsonrpc: '2.0',
        params: {
          family_id: family_id,
          access_card_replacement_id : access_card_replacement_id,
          reason_for_replacement : reason_for_replacement
        },
    };

    return this.http.post(`${this.postApiCard}`, body, { headers }).pipe(
        catchError(this.handleError)
    );
  }

  getCardFamilyMember(
    unit_id: number,
  ): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    });

    const body = {
        jsonrpc: '2.0',
        params: {
          unit_id: unit_id,
        },
    };

    return this.http.post(`${this.getApiCard}`, body, { headers }).pipe(
        catchError(this.handleError)
    );
  }

  // Pet API methods
  private postApiPet = this.baseUrl + '/resident/post/request_pet_registration';
  postPetAPI(
    block_id: number,
    unit_id: number,
    type_of_pet: string,
    pet_breed: string,
    pet_license: string,
    pet_image: string,
    notes: string,
  ): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    });

    const body = {
        jsonrpc: '2.0',
        params: {
          block_id: block_id,
          unit_id: unit_id,
          type_of_pet: type_of_pet,
          pet_breed: pet_breed,
          pet_license: pet_license,
          pet_image: pet_image,
          notes: notes,
        },
    };

    return this.http.post(`${this.postApiPet}`, body, { headers }).pipe(
        catchError(this.handleError)
    );
  }

  // Coach API methods
  private getFacilityApi = this.baseUrl + '/resident/get/facilities';
  private getTypeApiCoach = this.baseUrl + '/vms/get/get_coach_type';
  private postApiCoach = this.baseUrl + '/resident/post/request_register_coach';
  private getExpectedCoachByUnitApi = this.baseUrl + '/residential/get/registered_coaches_based_on_unit';
  getFacilities(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    });

    const body = {
        jsonrpc: '2.0',
        params: {},
    };

    return this.http.post(`${this.getFacilityApi}`, body, { headers }).pipe(
        catchError(this.handleError)
    );
  }
  getTypeCoach(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    });

    const body = {
        jsonrpc: '2.0',
        params: {},
    };

    return this.http.post(`${this.getTypeApiCoach}`, body, { headers }).pipe(
        catchError(this.handleError)
    );
  }

  postRegiterRequestCoach(
    block_id?: number,
    unit_id?: number,
    coach_name?: string,
    contact_number?: string,
    coach_sex?: string,
    nationality?: string,
    affliated_organization?: string,
    coaching_reg_number?: string,
    type_of_coaching?: string,
    facility_required?: string,
    facility_required_other?: string,
    expected_start_date?: string,
    duration_per_session?: string,
    registered_coach_id?: number,
  ): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    });

    const body = {
        jsonrpc: '2.0',
        params: {
          block_id: block_id,
          unit_id: unit_id,
          coach_name: coach_name,
          contact_number: contact_number,
          coach_sex: coach_sex,
          nationality: nationality,
          affliated_organization: affliated_organization,
          coaching_reg_number: coaching_reg_number,
          type_of_coaching: type_of_coaching,
          facility_required: facility_required,
          facility_required_other: facility_required_other,
          expected_start_date: expected_start_date,
          duration_per_session: duration_per_session,
          registered_coach_id: registered_coach_id,
        },
    };

    return this.http.post(`${this.postApiCoach}`, body, { headers }).pipe(
        catchError(this.handleError)
    );
  }

  getExpectedCoachByUnit(unit_id: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    });

    const body = {
        jsonrpc: '2.0',
        params: {
          unit_id: unit_id,
        },
    };

    return this.http.post(`${this.getExpectedCoachByUnitApi}`, body, { headers }).pipe(
        catchError(this.handleError)
    );
  }

  private postApiForUpdateVehicleNumber = this.baseUrl + '/resident/post/update_expected_visitor';

  postUpdateVehicleNumber(
    visitor_id: number, 
    vehicle_number: string
  ): Observable<any> {
      const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept': 'application/json',
      });
  
      const body = {
        jsonrpc: '2.0',
        params: {
          visitor_id: visitor_id,
          vehicle_number: vehicle_number,
        },
      };
  
      return this.http.post(this.postApiForUpdateVehicleNumber, body, { headers }).pipe(
          catchError(this.handleError)
      );
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    
    if (error.error instanceof ErrorEvent) {
      console.error('Client-side error:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`
      );
    }

    return throwError(() => new Error('Something went wrong; please try again later.'));
  }
}
