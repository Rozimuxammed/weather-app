import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useDispatch, useSelector } from "react-redux";
import politicalMap from "../assets/earth.png";
import {
  setWeatherInfo,
  setWeatherLocalInfo,
} from "../lib/redux/slices/weatherData-slice";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { MoonIcon, Sun, Droplet, Wind, Cloud, Volume2 } from "lucide-react";
import axios from "axios";
import { Skeleton } from "./ui/skeleton";
import { useNavigate } from "react-router-dom";

const WeatherIcon = ({ iconCode, size = "w-10 h-10 sm:w-12 sm:h-12" }) => {
  const iconMap = {
    "01d": <Sun className={`${size} text-yellow-400 animate-pulse`} />,
    "01n": <MoonIcon className={`${size} text-indigo-300`} />,
    "02d": <Cloud className={`${size} text-gray-300`} />,
    "02n": <Cloud className={`${size} text-gray-400`} />,
    "03d": <Cloud className={`${size} text-gray-400`} />,
    "03n": <Cloud className={`${size} text-gray-500`} />,
    "04d": <Cloud className={`${size} text-gray-500`} />,
    "04n": <Cloud className={`${size} text-gray-600`} />,
    "10d": <Cloud className={`${size} text-blue-400`} />,
    "10n": <Cloud className={`${size} text-blue-500`} />,
    "09d": <Cloud className={`${size} text-blue-400`} />,
    "09n": <Cloud className={`${size} text-blue-500`} />,
    "11d": <Cloud className={`${size} text-yellow-300`} />,
    "11n": <Cloud className={`${size} text-yellow-400`} />,
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

function EarthSphere({ onClickEarth }) {
  const earthRef = useRef();
  const { mouse } = useThree();
  const targetRotation = useRef({ x: 0, y: 0 });

  useFrame(() => {
    if (earthRef.current) {
      targetRotation.current.y += 0.001;
      targetRotation.current.y += mouse.x * 0.005;
      targetRotation.current.x = THREE.MathUtils.clamp(
        mouse.y * 0.5,
        -Math.PI / 4,
        Math.PI / 4
      );

      earthRef.current.rotation.y = THREE.MathUtils.lerp(
        earthRef.current.rotation.y,
        targetRotation.current.y,
        0.1
      );
      earthRef.current.rotation.x = THREE.MathUtils.lerp(
        earthRef.current.rotation.x,
        targetRotation.current.x,
        0.1
      );
    }
  });

  const texture = new THREE.TextureLoader().load(politicalMap);

  const handlePointerDown = (e) => {
    const point = e.point;
    const radius =
      window.innerWidth < 640 ? 2.0 : window.innerWidth < 1024 ? 2.5 : 2.8;
    const lat = 90 - (Math.acos(point.y / radius) * 180) / Math.PI;
    const lon =
      (((Math.atan2(point.z, point.x) * 180) / Math.PI + 180) % 360) - 180;
    onClickEarth({ lat, lon });
  };

  return (
    <mesh ref={earthRef} onPointerDown={handlePointerDown}>
      <sphereGeometry
        args={[
          window.innerWidth < 640 ? 2.0 : window.innerWidth < 1024 ? 2.5 : 2.8,
          64,
          64,
        ]}
      />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}

export default function Earth() {
  const [inputValue, setInputValue] = useState("");
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const dispatch = useDispatch();
  const { weatherInfo, weatherLocalInfo } = useSelector(
    (state) => state.weatherReducer
  );

  const apiKey = "129796c288d562d3a9ef920c68ee1612";

  const getHealthAdvice = (temp) => {
    if (temp < 0) {
      return "Носите тёплую одежду, избегайте холода.";
    } else if (temp >= 0 && temp < 15) {
      return "Носите лёгкую тёплую одежду.";
    } else if (temp >= 15 && temp < 25) {
      return "Погода комфортная, будьте активны на свежем воздухе.";
    } else if (temp >= 25 && temp < 35) {
      return "Пейте больше воды, держитесь в прохладном месте.";
    } else {
      return "Остерегайтесь жары, пейте больше воды и оставайтесь в тени.";
    }
  };

  const speakWeather = (cityName, temp) => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    const roundedTemp = Math.round(temp);
    const advice = getHealthAdvice(roundedTemp);
    const message = `В ${cityName} температура воздуха ${roundedTemp} градуса. ${advice}`;
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = "ru-RU";
    utterance.volume = 1;
    utterance.rate = 1;
    utterance.pitch = 1;

    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find((voice) => voice.lang === "ru-RU");
    utterance.voice = voice;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        fetchWeatherByCoords({ lat, lon });
      },
      (error) => {
        toast.error("Ошибка при получении геолокации: " + error.message);
      }
    );
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    if (
      weatherLocalInfo &&
      weatherLocalInfo.city?.name &&
      weatherLocalInfo.list[0]?.main.temp &&
      weatherLocalInfo.city?.country
    ) {
      speakWeather(
        weatherLocalInfo.city.name,
        weatherLocalInfo.list[0].main.temp,
        weatherLocalInfo.city.country
      );
    }
  }, [weatherLocalInfo]);

  const toggleTheme = () => setDarkMode((prev) => !prev);

  const formatWeatherData = (data) => {
    const daily = data.list.filter((item, index) => index % 8 === 0);
    return daily.map((day) => ({
      date: day.dt_txt.split(" ")[0],
      temp: day.main.temp,
      humidity: day.main.humidity,
      wind: day.wind.speed,
      desc: day.weather[0].description,
      icon: day.weather[0].icon,
    }));
  };

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
    return days[new Date(dateStr).getDay()];
  };

  const fetchWeatherByCoords = async ({ lat, lon }) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
      );
      const data = response.data;
      if (data.cod !== "200") {
        throw new Error(data.message);
      }
      const formatted = formatWeatherData(data);
      dispatch(setWeatherInfo(formatted));
      dispatch(setWeatherLocalInfo(data));
    } catch (error) {
      toast.error(
        `Ошибка при получении данных о погоде: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByCity = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) {
      toast.error("Пожалуйста, введите название города");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${inputValue}&units=metric&appid=${apiKey}`
      );
      const data = response.data;
      if (data.cod !== "200") throw new Error(data.message);
      dispatch(setWeatherInfo(formatWeatherData(data)));
      dispatch(setWeatherLocalInfo(data));
      setInputValue("");
    } catch (error) {
      toast.error(
        `Ошибка при получении данных по городу: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen relative bg-[#0EA5E9] dark:bg-transparent flex flex-col">
      <div className="w-full z-20 bg-gradient-to-r from-[#0EA5E9]/80 to-blue-600/80 dark:from-gray-900/80 dark:to-gray-800/80 backdrop-blur-md p-4 flex flex-col sm:flex-row items-center justify-between shadow-xl rounded-b-2xl border-b border-white/20">
        <div
          onClick={() => window.location.reload()}
          className="font-extrabold cursor-pointer select-none text-xl sm:text-2xl text-white tracking-wide drop-shadow-sm mb-4 sm:mb-0"
        >
          ☁️ Погода
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <form
            onSubmit={fetchWeatherByCity}
            className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto"
          >
            <Input
              type="text"
              placeholder="Введите название города или страны"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full sm:w-64 px-4 py-2 rounded-lg text-sm font-medium bg-white/80 dark:bg-gray-700 text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-300 focus:ring-2 focus:ring-blue-300 focus:outline-none"
            />
            <Button
              type="submit"
              className="w-full sm:w-auto bg-white text-blue-600 hover:bg-blue-100 dark:bg-gray-100 dark:text-blue-700 dark:hover:bg-gray-200 font-semibold px-4 py-2 rounded-lg shadow"
            >
              Поиск
            </Button>
          </form>
          <Button
            onClick={toggleTheme}
            className="w-full sm:w-auto bg-white/30 dark:bg-gray-700 text-white dark:text-white rounded-lg p-2 border border-white/20 backdrop-blur-md hover:bg-white/50 dark:hover:bg-gray-600 hover:scale-105 transition-all duration-300"
          >
            {darkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <MoonIcon className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="w-full sm:absolute sm:top-10 max-w-xs mx-auto sm:mx-4 mt-4 sm:mt-16 z-20 bg-white/10 dark:bg-gray-900/10 bg-gradient-to-br from-[#0EA5E9]/50 to-blue-600/50 dark:from-gray-800/50 dark:to-gray-900/50 text-white dark:text-white border border-white/20 shadow-2xl rounded-2xl backdrop-blur-xl hover:bg-white/20 dark:hover:bg-gray-900/20 duration-300">
          <Skeleton className="h-[276px] rounded-2xl bg-white/30 dark:bg-gray-700" />
        </div>
      ) : (
        weatherLocalInfo && (
          <Card
            className={`w-full sm:absolute sm:top-10 max-w-xs mx-auto sm:mx-4 mt-4 sm:mt-16 z-20 bg-white/10 dark:bg-gray-900/10 bg-gradient-to-br from-[#0EA5E9]/50 to-blue-600/50 dark:from-gray-800/50 dark:to-gray-900/50 text-white dark:text-white border border-white/20 shadow-2xl rounded-2xl backdrop-blur-xl hover:bg-white/20 dark:hover:bg-gray-900/20 duration-300 ${
              isSpeaking ? "animate-pulse scale-105" : ""
            }`}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-xl sm:text-2xl font-semibold tracking-wide flex items-center gap-2">
                <WeatherIcon
                  iconCode={weatherLocalInfo.list[0]?.weather[0]?.icon}
                  size="w-8 h-8 sm:w-10 sm:h-10"
                />
                {weatherLocalInfo.city.name || "Неизвестное место"}
                {isSpeaking && (
                  <Volume2 className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-400 animate-pulse" />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-col mb-3 items-start space-y-2">
                <p className="text-3xl sm:text-4xl font-bold mb-3">
                  {Math.round(weatherLocalInfo.list[0]?.main.temp || 0)}°C
                </p>
                <div className="flex items-center gap-2 text-sm text-white/70">
                  <Droplet className="h-4 w-4 text-blue-400" />
                  <span>
                  Влажность: {weatherLocalInfo.list[0]?.main.humidity || 0}%
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-white/70">
                  <Wind className="h-4 w-4 text-cyan-400" />
                  <span>
                  Ветер: {weatherLocalInfo.list[0]?.wind.speed || 0} m/s
                  </span>
                </div>
              </div>
              <Button
                className="w-full sm:w-auto bg-white/30 dark:bg-gray-700 text-white dark:text-white p-2 border border-white/20 backdrop-blur-md hover:bg-white/50 dark:hover:bg-gray-600 hover:scale-105 transition-all duration-300"
                variant="outline"
                onClick={() => {
                  navigate("/locationWeatherInfo", {
                    state: { weatherData: weatherLocalInfo },
                  });
                  speakWeather(
                    weatherLocalInfo.city.name,
                    weatherLocalInfo.list[0].main.temp,
                    weatherLocalInfo.city.country
                  );
                }}
              >
                Подробнее
              </Button>
            </CardContent>
          </Card>
        )
      )}

      <div className="w-full h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-[70vh] relative z-0">
        <Canvas
          camera={{
            position: [
              0,
              0,
              window.innerWidth < 640
                ? 5
                : window.innerWidth < 1024
                ? 5.5
                : 5.5,
            ],
          }}
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[2, 0, 5]} intensity={1} />
          {window.innerWidth >= 640 && (
            <Stars
              radius={100}
              depth={50}
              count={5000}
              factor={4}
              fade
              speed={1}
            />
          )}
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableRotate={window.innerWidth >= 640}
          />
          <EarthSphere onClickEarth={fetchWeatherByCoords} />
        </Canvas>
      </div>

      {loading ? (
        <div className="w-full px-4 py-4 z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton
              key={i}
              className="h-56 rounded-2xl bg-white/30 dark:bg-gray-700"
            />
          ))}
        </div>
      ) : (
        weatherInfo.length > 0 && (
          <div className="w-full px-4 py-4 z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {weatherInfo.map((item, i) => (
              <Card
                key={i}
                className="w-full max-w-xs mx-auto group relative bg-white/10 dark:bg-gray-900/10 bg-gradient-to-br from-[#0EA5E9]/50 to-blue-600/50 dark:from-gray-800/50 dark:to-gray-900/50 text-white dark:text-white border border-white/20 shadow-2xl rounded-2xl backdrop-blur-xl hover:bg-white/20 dark:hover:bg-gray-900/20 duration-300transition-all duration-500 hover:scale-105 hover:-translate-y-2 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#0EA5E9]/30 to-blue-600/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <CardHeader className="pb-1">
                    <CardTitle className="text-base sm:text-lg font-bold tracking-wide text-white">
                      {getWeekDay(item.date)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="flex justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                        <WeatherIcon
                          iconCode={item.icon}
                          size="w-8 h-8 sm:w-10 sm:h-10"
                        />
                      </div>
                      <div className="text-xl sm:text-2xl font-black text-white mb-3">
                        {Math.round(item.temp)}°C
                      </div>
                      <div className="space-y-3 w-full">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2 text-white/70">
                            <Droplet className="h-4 w-4 text-blue-400" />
                            <span>Влажность</span>
                          </div>
                          <span className="text-white font-semibold">
                            {item.humidity}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2 text-white/70">
                            <Wind className="h-4 w-4 text-cyan-400" />
                            <span>Ветер</span>
                          </div>
                          <span className="text-white font-semibold">
                            {item.wind} m/s
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0EA5E9]/90 to-blue-600/90 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              </Card>
            ))}
          </div>
        )
      )}
    </div>
  );
}
