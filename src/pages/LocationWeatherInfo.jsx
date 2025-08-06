import React from "react";
import { useLocation } from "react-router-dom";
import {
  Sun,
  Moon,
  MapPin,
  Droplet,
  Wind,
  Eye,
  Thermometer,
  Gauge,
  Cloud,
  CloudRain,
} from "lucide-react";

const WeatherIcon = ({ iconCode, size = "w-16 h-16" }) => {
  const iconMap = {
    "01d": <Sun className={`${size} text-yellow-400 animate-pulse`} />,
    "01n": <Moon className={`${size} text-indigo-300`} />,
    "02d": <Cloud className={`${size} text-gray-300`} />,
    "02n": <Cloud className={`${size} text-gray-400`} />,
    "03d": <Cloud className={`${size} text-gray-400`} />,
    "03n": <Cloud className={`${size} text-gray-500`} />,
    "04d": <Cloud className={`${size} text-gray-500`} />,
    "04n": <Cloud className={`${size} text-gray-600`} />,
    "10d": <CloudRain className={`${size} text-blue-400`} />,
    "10n": <CloudRain className={`${size} text-blue-500`} />,
    "09d": <CloudRain className={`${size} text-blue-400`} />,
    "09n": <CloudRain className={`${size} text-blue-500`} />,
    "11d": <CloudRain className={`${size} text-yellow-300`} />,
    "11n": <CloudRain className={`${size} text-yellow-400`} />,
    "13d": <Cloud className={`${size} text-white`} />,
    "13n": <Cloud className={`${size} text-gray-100`} />,
    "50d": <Cloud className={`${size} text-gray-400`} />,
    "50n": <Cloud className={`${size} text-gray-500`} />,
  };

  return (
    iconMap[iconCode] || (
      <img
        src={`http://openweathermap.org/img/wn/${iconCode}@2x.png`}
        alt="weather icon"
        className={size}
      />
    )
  );
};

const StatCard = ({ icon, label, value, color = "text-blue-300" }) => (
  <div className="group bg-white/5 backdrop-blur-sm rounded-2xl p-4 hover:bg-white/10 transition-all duration-300 hover:scale-105 border border-white/20">
    <div className="flex items-center gap-3">
      <div
        className={`p-2 rounded-xl bg-gradient-to-br from-[#0EA5E9]/30 to-blue-600/30 ${color} group-hover:scale-110 transition-transform duration-300`}
      >
        {icon}
      </div>
      <div>
        <p className="text-white/60 text-sm font-medium">{label}</p>
        <p className="text-white text-lg font-bold">{value}</p>
      </div>
    </div>
  </div>
);

export default function BeautifulWeatherUI() {
  const location = useLocation();
  const weatherData = location.state?.weatherData;

  if (!weatherData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0EA5E9]/90 to-blue-600/90 dark:from-[#0b1c2c] dark:to-gray-900">
        <div className="text-center p-8 bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20">
          <div className="animate-spin w-12 h-12 border-4 border-white/30 border-t-white rounded-full mx-auto mb-4"></div>
          <p className="text-2xl font-semibold text-white">
            Ma'lumot topilmadi.
          </p>
        </div>
      </div>
    );
  }

  const city = weatherData.city;
  const forecastList = weatherData.list.slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0EA5E9]/90 to-blue-600/90 dark:from-[#0b1c2c] dark:to-gray-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/5 rounded-full animate-bounce"
          style={{ animationDuration: "3s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/4 w-32 h-32 bg-white/5 rounded-full animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="relative z-10 p-4 md:p-8 max-w-7xl mx-auto">
        {/* Main City Card */}
        <div className="mb-8 transform hover:scale-[1.02] transition-all duration-500">
          <div className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            {/* Header with city info */}
            <div className="relative p-6 md:p-8">
              <div className="absolute inset-0 bg-gradient-to-br from-[#0EA5E9]/30 to-blue-600/30"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-[#0EA5E9]/90 to-blue-600/90 rounded-2xl">
                      <MapPin className="h-8 w-8 text-yellow-400" />
                    </div>
                    <div>
                      <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                        {city.name}
                      </h1>
                      <p className="text-white/70 text-lg font-medium">
                        {city.country}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-6xl md:text-8xl font-black text-white mb-2">
                      {Math.round(forecastList[0]?.main.temp || 0)}°
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      <WeatherIcon
                        iconCode={forecastList[0]?.weather[0]?.icon}
                        size="w-12 h-12"
                      />
                      <span className="text-white/80 capitalize text-lg">
                        {forecastList[0]?.weather[0]?.description}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Current weather stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <StatCard
                    icon={<Thermometer className="h-5 w-5" />}
                    label="His qilinadi"
                    value={`${Math.round(
                      forecastList[0]?.main.feels_like || 0
                    )}°C`}
                    color="text-yellow-400"
                  />
                  <StatCard
                    icon={<Droplet className="h-5 w-5" />}
                    label="Namlik"
                    value={`${forecastList[0]?.main.humidity || 0}%`}
                    color="text-blue-400"
                  />
                  <StatCard
                    icon={<Wind className="h-5 w-5" />}
                    label="Shamol"
                    value={`${forecastList[0]?.wind.speed || 0} m/s`}
                    color="text-cyan-400"
                  />
                  <StatCard
                    icon={<Eye className="h-5 w-5" />}
                    label="Ko'rinish"
                    value={`${(
                      (forecastList[0]?.visibility || 0) / 1000
                    ).toFixed(1)} km`}
                    color="text-indigo-400"
                  />
                </div>

                {/* Sun times and additional info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white/80">
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                    <Sun className="h-6 w-6 text-yellow-400" />
                    <div>
                      <p className="text-sm text-white/60">Quyosh chiqishi</p>
                      <p className="font-bold">
                        {new Date(city.sunrise * 1000).toLocaleTimeString(
                          "uz-UZ",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                    <Moon className="h-6 w-6 text-indigo-400" />
                    <div>
                      <p className="text-sm text-white/60">Quyosh botishi</p>
                      <p className="font-bold">
                        {new Date(city.sunset * 1000).toLocaleTimeString(
                          "uz-UZ",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Forecast Section */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#0EA5E9]/30 to-blue-600/30 rounded-lg flex items-center justify-center">
              <Cloud className="h-5 w-5 text-white" />
            </div>
            3 soatlik ob-havo ma'lumoti
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {forecastList.map((item, index) => (
              <div
                key={index}
                className="group relative bg-white/10 backdrop-blur-xl rounded-3xl p-6 hover:bg-white/20 transition-all duration-500 hover:scale-105 hover:-translate-y-2 border border-white/20 overflow-hidden"
              >
                {/* Card background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#0EA5E9]/30 to-blue-600/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="relative z-10">
                  {/* Date and time */}
                  <div className="text-center mb-4">
                    <p className="text-white font-bold text-lg">
                      {new Date(item.dt * 1000).toLocaleDateString("uz-UZ", {
                        weekday: "short",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-white/60 text-sm">
                      {new Date(item.dt * 1000).toLocaleTimeString("uz-UZ", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  {/* Weather icon and temperature */}
                  <div className="text-center mb-4">
                    <div className="flex justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                      <WeatherIcon
                        iconCode={item.weather[0].icon}
                        size="w-16 h-16"
                      />
                    </div>
                    <div className="text-3xl font-black text-white mb-1">
                      {Math.round(item.main.temp)}°
                    </div>
                    <p className="text-white/80 capitalize text-sm font-medium">
                      {item.weather[0].description}
                    </p>
                  </div>

                  {/* Weather details */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-white/70">
                        <Thermometer className="h-4 w-4 text-yellow-400" />
                        <span>His qilinadi</span>
                      </div>
                      <span className="text-white font-semibold">
                        {Math.round(item.main.feels_like)}°
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-white/70">
                        <Droplet className="h-4 w-4 text-blue-400" />
                        <span>Namlik</span>
                      </div>
                      <span className="text-white font-semibold">
                        {item.main.humidity}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-white/70">
                        <Wind className="h-4 w-4 text-cyan-400" />
                        <span>Shamol</span>
                      </div>
                      <span className="text-white font-semibold">
                        {item.wind.speed} m/s
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-white/70">
                        <Eye className="h-4 w-4 text-indigo-400" />
                        <span>Ko'rinish</span>
                      </div>
                      <span className="text-white font-semibold">
                        {((item.visibility || 0) / 1000).toFixed(1)} km
                      </span>
                    </div>
                  </div>
                </div>

                {/* Hover effect indicator */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0EA5E9]/90 to-blue-600/90 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Info Card */}
        <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
            <MapPin className="h-6 w-6 text-red-400" />
            Qo'shimcha ma'lumotlar
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white/80">
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
              <span className="text-2xl">🌍</span>
              <div>
                <p className="text-sm text-white/60">Koordinatalar</p>
                <p className="font-bold">
                  {city.coord?.lat?.toFixed(4) || "N/A"},{" "}
                  {city.coord?.lon?.toFixed(4) || "N/A"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
              <span className="text-2xl">⏰</span>
              <div>
                <p className="text-sm text-white/60">Vaqt zonasi</p>
                <p className="font-bold">
                  UTC {(city.timezone || 0) / 3600 >= 0 ? "+" : ""}
                  {Math.round((city.timezone || 0) / 3600)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
