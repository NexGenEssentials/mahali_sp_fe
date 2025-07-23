import { TourPackageType } from "../types/service/tour";

export function getAllToursData(
  data: Record<string, any[]>
): TourPackageType[] {
  const tours: TourPackageType[] = [];

  for (const country in data) {
    if (Array.isArray(data[country])) {
      data[country].forEach((tour) => {
        tours.push({
          id: tour.id,
          title: tour.title,
          description: tour.description,
          location: tour.location,
          prices: tour.prices,
          duration_days: tour.duration_days,
          duration_nights: tour.duration_nights || 0, // Default value if missing
          rating: tour.rating,
          best_time_to_visit: tour.best_time_to_visit || "Unknown", // Default value if missing
          min_people: tour.min_people || 1, // Default value if missing
          max_people: tour.max_people || 10,
          main_image: tour.main_image,
          is_active: tour.is_active || false,
          tour_plans: tour.tour_plans || [],
          related_packages: tour.related_packages || [],
          images: tour.images || [],
          country: tour.country || 0,
          created_at: tour.created_at,
          updated_at: tour.updated_at,
        });
      });
    }
  }

  return tours;
}
