export interface LoginParams {
    login: string;
    password: string;
}

export interface EstateProfile {
    family_id: number;
    family_name: string;
    family_email: string;
    family_mobile_number: string;
    family_type: string;
    unit_id: number;
    unit_name: string;
    block_id: number;
    block_name: string;
    project_id: number;
    project_name: string;
    project_image: string;
}

export interface Estate {
    user_id: number;
    family_id: number;
    family_name: string;
    employee_extension_number: string;
    family_nickname: string;
    image_profile: string;
    family_email: string;
    family_mobile_number: string;
    family_type: string;
    unit_id: number;
    unit_name: string;
    block_id: number;
    block_name: string;
    project_id: number;
    project_name: string;
    project_image: string;
    record_type: string;
    intercom_code: string
}

// visitor
export interface FormData {
    dateOfInvite: string;
    vehicleNumber: string;
    entryType: string;
    entryTitle: string;
    entryMessage: string;
    isProvideUnit: boolean;
    facility: string,
    facility_other: string,
    hiredCar: string;
    unit: number;
}

export interface InviteeNew {
  visitor_name: string;
  vehicle_number: string;
  contact_number: string;
  contact_number_display: string;
  company_name: string;
  host_ids: number[];
}

export interface Invitee {
  visitor_name: string;
  vehicle_number: string;
  contact_number: string;
  contact_number_display: string;
  company_name: string;
  host_ids: [] // Pastikan ini array kosong
}

export interface FamilyDetailResponse {
  response_code: number;
  response_result: {
    id: number;
    family_full_name: string;
    family_nickname: string;
    family_email: string;
    family_mobile_number: string;
    member_type: string;
  } | false;
}

export interface ExcelRow {
  Name: string;
  'Mobile Number': string | number;
  'Vehicle Number': string;
  'Company Name': string;
  'Host Related': string;
}