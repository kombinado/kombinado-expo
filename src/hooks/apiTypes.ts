export type RideStatus = "Aberta" | "Lotada" | "Concluída" | "Cancelada";

export type RideRequestStatus =
  | "Pendente"
  | "Aceita"
  | "Recusada"
  | "Cancelada";

export interface RideResponseDto {
  id: string;
  origin: string;
  destination: string;
  departureTime: string;
  totalSeats: number;
  availableSeats: number;
  status: RideStatus;
}

export interface CreateRideDto {
  origin: string;
  destination: string;
  departureTime: string;
  totalSeats: number;
}

export interface RideFormData {
  origin: string;
  destination: string;
  time: string;
  spots: number;
}

export interface RideRequestResponseDto {
  id: string;
  passengerName: string | null;
  status: RideRequestStatus;
  meetingPointSuggestion: string | null;
  phoneNumber: string | null;
}

export interface CreateRideRequestDto {
  meetingPointSuggestion?: string | null;
}

export interface RespondRequestDto {
  accept: boolean;
}

export type RequestedRideCardStatus = "aceita" | "pendente" | "negada";

export function toRequestedRideCardStatus(
  status: RideRequestStatus,
): RequestedRideCardStatus {
  if (status === "Aceita") return "aceita";
  if (status === "Pendente") return "pendente";
  return "negada";
}

export function formatRideDate(departureTime: string): string {
  const date = new Date(departureTime);
  if (Number.isNaN(date.getTime())) return "--/--";

  return `${String(date.getDate()).padStart(2, "0")}/${String(
    date.getMonth() + 1,
  ).padStart(2, "0")}`;
}

export function formatRideTime(departureTime: string): string {
  const date = new Date(departureTime);
  if (Number.isNaN(date.getTime())) return "--:--";

  return `${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes(),
  ).padStart(2, "0")}`;
}

export function buildCreateRidePayload(data: RideFormData): CreateRideDto {
  return {
    origin: data.origin.trim(),
    destination: data.destination.trim(),
    departureTime: buildDepartureTime(data.time).toISOString(),
    totalSeats: data.spots,
  };
}

function buildDepartureTime(time: string): Date {
  const normalized = time.trim().replace(/[hH]/, ":");
  const match = normalized.match(/^(\d{1,2}):(\d{2})$/);

  if (!match) {
    throw new Error("Informe o horário no formato HH:mm.");
  }

  const hours = Number(match[1]);
  const minutes = Number(match[2]);

  if (hours > 23 || minutes > 59) {
    throw new Error("Informe um horário válido.");
  }

  const now = new Date();
  const departure = new Date(now);
  departure.setHours(hours, minutes, 0, 0);

  if (departure.getTime() <= now.getTime()) {
    departure.setDate(departure.getDate() + 1);
  }

  return departure;
}
