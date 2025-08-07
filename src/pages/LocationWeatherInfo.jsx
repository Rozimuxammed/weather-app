import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Sun,
  Moon,
  MapPin,
  Droplet,
  Wind,
  Eye,
  Thermometer,
  Cloud,
  CloudRain,
  X,
} from "lucide-react";
import { Button } from "../components/ui/button";

const WeatherIcon = ({ iconCode, size = "w-12 h-12 sm:w-16 sm:h-16" }) => {
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
        alt="Иконка погоды"
        className={size}
      />
    )
  );
};

const StatCard = ({ icon, label, value, color = "text-blue-300" }) => (
  <div className="group bg-white/10 backdrop-blur-sm rounded-2xl p-3 sm:p-4 hover:bg-white/20 transition-all duration-300 hover:scale-105 border border-white/20">
    <div className="flex items-center gap-2 sm:gap-3">
      <div
        className={`p-2 rounded-xl bg-gradient-to-br from-[#0EA5E9]/30 to-blue-600/30 ${color} group-hover:scale-110 transition-transform duration-300`}
      >
        {icon}
      </div>
      <div>
        <p className="text-white/60 text-xs sm:text-sm font-medium">{label}</p>
        <p className="text-white text-base sm:text-lg font-bold">{value}</p>
      </div>
    </div>
  </div>
);

const getWeekDay = (dateStr) => {
  const days = [
    "Воскресенье",
    "Понедельник",
    "Вторник",
    "Среда",
    "Четверг",
    "Пятница",
    "Суббота",
  ];
  const date = new Date(dateStr * 1000);
  const dayIndex = date.getDay();
  const dayNumber = date.getDate();
  return `${dayNumber} ${days[dayIndex]}`;
};

const WeatherBackground = ({ iconCode }) => {
  const getWeatherAnimationClass = () => {
    if (!iconCode) return "animate-cloudy";
    if (["01d", "01n"].includes(iconCode)) {
      return "animate-sunny";
    } else if (["09d", "09n", "10d", "10n"].includes(iconCode)) {
      return "animate-rainy";
    } else if (["11d", "11n"].includes(iconCode)) {
      return "animate-thunder";
    } else if (["13d", "13n"].includes(iconCode)) {
      return "animate-snowy";
    } else if (["50d", "50n"].includes(iconCode)) {
      return "animate-foggy";
    } else {
      return "animate-cloudy";
    }
  };

  const animationClass = getWeatherAnimationClass();
  const isParticleEffect = [
    "animate-rainy",
    "animate-snowy",
    "animate-foggy",
  ].includes(animationClass);
  const particleCount = isParticleEffect
    ? window.innerWidth < 640
      ? 30
      : 50
    : 5;

  const particles = Array.from({ length: particleCount }).map((_, i) => {
    const style = isParticleEffect
      ? {
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * -20}%`,
          animationDelay: `${Math.random() * 3}s`,
          animationDuration: `${2 + Math.random() * 2}s`,
        }
      : i === 0
      ? {
          top: "10%",
          right: "10%",
          width: window.innerWidth < 640 ? "12rem" : "20rem",
          height: window.innerWidth < 640 ? "12rem" : "20rem",
        }
      : i === 1
      ? {
          bottom: "10%",
          left: "10%",
          width: window.innerWidth < 640 ? "15rem" : "25rem",
          height: window.innerWidth < 640 ? "15rem" : "25rem",
        }
      : i === 2
      ? {
          top: "50%",
          left: "30%",
          width: window.innerWidth < 640 ? "8rem" : "12rem",
          height: window.innerWidth < 640 ? "8rem" : "12rem",
        }
      : i === 3
      ? {
          top: "20%",
          left: "60%",
          width: window.innerWidth < 640 ? "10rem" : "15rem",
          height: window.innerWidth < 640 ? "10rem" : "15rem",
        }
      : {
          bottom: "20%",
          right: "20%",
          width: window.innerWidth < 640 ? "9rem" : "14rem",
          height: window.innerWidth < 640 ? "9rem" : "14rem",
        };

    return (
      <div
        key={i}
        className={`absolute rounded-full ${animationClass}`}
        style={style}
      ></div>
    );
  });

  return (
    <div className="absolute inset-0 pointer-events-none z-0">{particles}</div>
  );
};

export default function BeautifulWeatherUI() {
  const location = useLocation();
  const weatherData = location.state?.weatherData;

  if (!weatherData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0EA5E9]/70 to-blue-600/70 dark:from-[#0b1c2c]/70 dark:to-gray-900/70">
        <div className="text-center p-6 sm:p-8 bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20">
          <div className="animate-spin w-10 h-10 sm:w-12 sm:h-12 border-4 border-white/30 border-t-white rounded-full mx-auto mb-4"></div>
          <p className="text-xl sm:text-2xl font-semibold text-white">
            Данные не найдены
          </p>
        </div>
      </div>
    );
  }

  const city = weatherData.city;
  const forecastList = weatherData.list.slice(0, 5);
  const weatherIcon = weatherData.list[0]?.weather[0]?.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0EA5E9]/70 to-blue-600/70 dark:from-[#0b1c2c]/70 dark:to-gray-900/70 relative overflow-hidden">
      <style>
        {`
          @keyframes pulse-sunny {
            0% { transform: scale(1); opacity: 0.3; }
            50% { transform: scale(1.3); opacity: 0.5; }
            100% { transform: scale(1); opacity: 0.3; }
          }
          @keyframes fall-rain {
            0% { transform: translateY(-100vh) translateX(0); opacity: 0.8; }
            100% { transform: translateY(100vh) translateX(-20px); opacity: 0.3; }
          }
          @keyframes slide-cloud {
            0% { transform: translateX(-100vw); opacity: 0.4; }
            100% { transform: translateX(100vw); opacity: 0.4; }
          }
          @keyframes flash-thunder {
            0% { opacity: 0; }
            10% { opacity: 0.8; }
            15% { opacity: 0; }
            20% { opacity: 0.6; }
            25% { opacity: 0; }
            100% { opacity: 0; }
          }
          @keyframes fall-snow {
            0% { transform: translateY(-100vh) translateX(0); opacity: 0.8; }
            100% { transform: translateY(100vh) translateX(10px); opacity: 0.3; }
          }
          @keyframes drift-fog {
            0% { transform: translateX(0); opacity: 0.2; }
            50% { transform: translateX(50px); opacity: 0.3; }
            100% { transform: translateX(0); opacity: 0.2; }
          }
          .animate-sunny {
            background: radial-gradient(circle, rgba(255, 255, 0, 0.4), transparent);
            animation: pulse-sunny 4s ease-in-out infinite;
            box-shadow: 0 0 20px rgba(255, 255, 0, 0.3);
          }
          .animate-rainy {
            background: linear-gradient(180deg, rgba(0, 191, 255, 0.8), rgba(0, 191, 255, 0.3));
            width: 3px;
            height: 15px;
            border-radius: 2px;
            animation: fall-rain 1s linear infinite;
            box-shadow: 0 0 5px rgba(0, 191, 255, 0.5);
          }
          .animate-cloudy {
            background: radial-gradient(circle, rgba(200, 200, 200, 0.5), transparent);
            animation: slide-cloud 15s linear infinite;
          }
          .animate-thunder {
            background: radial-gradient(circle, rgba(255, 255, 0, 0.7), transparent);
            animation: flash-thunder 2s ease-in-out infinite;
            box-shadow: 0 0 25px rgba(255, 255, 0, 0.4);
          }
          .animate-snowy {
            background: radial-gradient(circle, rgba(255, 255, 255, 0.8), transparent);
            width: 6px;
            height: 6px;
            border-radius: 50%;
            animation: fall-snow 2s linear infinite;
            box-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
          }
          .animate-foggy {
            background: radial-gradient(circle, rgba(150, 150, 150, 0.4), transparent);
            animation: drift-fog 12s ease-in-out infinite;
          }
          @media (max-width: 640px) {
            .animate-sunny, .animate-thunder, .animate-foggy, .animate-cloudy {
              width: 8rem !important;
              height: 8rem !important;
            }
            .animate-rainy {
              width: 2px;
              height: 10px;
            }
            .animate-snowy {
              width: 4px;
              height: 4px;
            }
          }
        `}
      </style>
      <WeatherBackground iconCode={weatherIcon} />
      <Link
        to="/"
        className="absolute cursor-pointer top-2 sm:top-4 right-2 sm:right-4 z-20 bg-white/30 dark:bg-gray-700 text-white dark:text-white rounded-lg p-2 border border-white/20 backdrop-blur-md hover:bg-white/50 dark:hover:bg-gray-600 hover:scale-105 transition-all duration-300"
      >
        <X className="h-6 w-6 sm:h-8 sm:w-8 text-gray-950 dark:text-white" />
      </Link>
      <div className="relative z-10 p-3 sm:p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Main City Card */}
        <div className="mb-6 sm:mb-8 transform hover:scale-[1.02] transition-all duration-500">
          <div className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            <div className="relative p-4 sm:p-6 md:p-8">
              <div className="absolute inset-0 bg-gradient-to-br from-[#0EA5E9]/30 to-blue-600/30"></div>
              <div className="relative z-10">
                <div className="flex flex-col sm:flex-row items-center justify-between mb-4 sm:mb-6">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="p-2 sm:p-3 bg-gradient-to-br from-[#0EA5E9]/90 to-blue-600/90 rounded-2xl">
                      <MapPin className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-400" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight">
                      {city.name || "Неизвестное место"}
                    </h1>
                  </div>
                  <div className="text-center sm:text-right mt-4 sm:mt-0">
                    <div className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black text-white mb-2">
                      {Math.round(forecastList[0]?.main.temp || 0)}°
                    </div>
                    <div className="flex items-center justify-center sm:justify-end gap-2">
                      <WeatherIcon
                        iconCode={forecastList[0]?.weather[0]?.icon}
                        size="w-10 h-10 sm:w-12 sm:h-12"
                      />
                      <span className="text-white/80 capitalize text-sm sm:text-lg">
                        {forecastList[0]?.weather[0]?.description}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <StatCard
                    icon={<Thermometer className="h-4 w-4 sm:h-5 sm:w-5" />}
                    label="Температура"
                    value={`${Math.round(
                      forecastList[0]?.main.feels_like || 0
                    )}°C`}
                    color="text-yellow-400"
                  />
                  <StatCard
                    icon={<Droplet className="h-4 w-4 sm:h-5 sm:w-5" />}
                    label="Влажность"
                    value={`${forecastList[0]?.main.humidity || 0}%`}
                    color="text-blue-400"
                  />
                  <StatCard
                    icon={<Wind className="h-4 w-4 sm:h-5 sm:w-5" />}
                    label="Ветер"
                    value={`${forecastList[0]?.wind.speed || 0} м/с`}
                    color="text-cyan-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-white/80">
                  <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-white/5 rounded-xl">
                    <Sun className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-400" />
                    <div>
                      <p className="text-xs sm:text-sm text-white/60">
                        Восход солнца
                      </p>
                      <p className="font-bold text-sm sm:text-base">
                        {new Date(city.sunrise * 1000).toLocaleTimeString(
                          "ru-RU",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-white/5 rounded-xl">
                    <Moon className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-400" />
                    <div>
                      <p className="text-xs sm:text-sm text-white/60">
                        Закат солнца
                      </p>
                      <p className="font-bold text-sm sm:text-base">
                        {new Date(city.sunset * 1000).toLocaleTimeString(
                          "ru-RU",
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

        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-[#0EA5E9]/30 to-blue-600/30 rounded-lg flex items-center justify-center">
              <Cloud className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            Прогноз погоды на 3 часа
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
            {forecastList.map((item, index) => (
              <div
                key={index}
                className="group relative bg-white/10 backdrop-blur-xl rounded-3xl p-4 sm:p-6 hover:bg-white/20 transition-all duration-500 hover:scale-105 hover:-translate-y-2 border border-white/20 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#0EA5E9]/30 to-blue-600/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="relative z-10">
                  <div className="text-center mb-3 sm:mb-4">
                    <p className="text-white font-bold text-base sm:text-lg">
                      {getWeekDay(item.dt)}
                    </p>
                    <p className="text-white/60 text-xs sm:text-sm">
                      {new Date(item.dt * 1000).toLocaleTimeString("ru-RU", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  <div className="text-center mb-3 sm:mb-4">
                    <div className="flex justify-center mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300">
                      <WeatherIcon
                        iconCode={item.weather[0].icon}
                        size="w-12 h-12 sm:w-16 sm:h-16"
                      />
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-white mb-1">
                      {Math.round(item.main.temp)}°
                    </div>
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <div className="flex items-center gap-1 sm:gap-2 text-white/70">
                        <Thermometer className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400" />
                        <span>Температура</span>
                      </div>
                      <span className="text-white font-semibold">
                        {Math.round(item.main.feels_like)}°
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <div className="flex items-center gap-1 sm:gap-2 text-white/70">
                        <Droplet className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400" />
                        <span>Влажность</span>
                      </div>
                      <span className="text-white font-semibold">
                        {item.main.humidity}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <div className="flex items-center gap-1 sm:gap-2 text-white/70">
                        <Wind className="h-3 w-3 sm:h-4 sm:w-4 text-cyan-400" />
                        <span>Ветер</span>
                      </div>
                      <span className="text-white font-semibold">
                        {item.wind.speed} м/с
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <div className="flex items-center gap-1 sm:gap-2 text-white/70">
                        <Eye className="h-3 w-3 sm:h-4 sm:w-4 text-indigo-400" />
                        <span>Видимость</span>
                      </div>
                      <span className="text-white font-semibold">
                        {((item.visibility || 0) / 1000).toFixed(1)} км
                      </span>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0EA5E9]/90 to-blue-600/90 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-4 sm:p-6 border border-white/20">
          <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
            <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-red-400" />
            Дополнительная информация
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-white/80">
            <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-white/5 rounded-xl">
              <span className="text-xl sm:text-2xl">🌍</span>
              <div>
                <p className="text-xs sm:text-sm text-white/60">Координаты</p>
                <p className="font-bold text-sm sm:text-base">
                  {city.coord?.lat?.toFixed(4) || "N/A"},{" "}
                  {city.coord?.lon?.toFixed(4) || "N/A"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-white/5 rounded-xl">
              <span className="text-xl sm:text-2xl">⏰</span>
              <div>
                <p className="text-xs sm:text-sm text-white/60">Часовой пояс</p>
                <p className="font-bold text-sm sm:text-base">
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
