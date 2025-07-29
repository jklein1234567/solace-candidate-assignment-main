export type Advocate = {
  id: number;
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties: string[];
  yearsOfExperience: number;
  phoneNumber: number;
};

export enum FilterField {
  FirstName = "firstName",
  LastName = "lastName",
  City = "city",
  PhoneNumber = "phoneNumber",
}
