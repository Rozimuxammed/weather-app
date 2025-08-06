import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useDispatch, useSelector } from "react-redux";
import politicalMap from "../assets/earth.jpg";
import {
  setWeatherInfo,
  setWeatherLocalInfo,
} from "../lib/redux/slices/weatherData-slice";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { MoonIcon, Sun } from "lucide-react";
import axios from "axios";
import { Skeleton } from "./ui/skeleton";
import { Link, useNavigate } from "react-router-dom";

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
    const radius = 3.5;
    const lat = 90 - (Math.acos(point.y / radius) * 180) / Math.PI;
    const lon =
      (((Math.atan2(point.z, point.x) * 180) / Math.PI + 180) % 360) - 180;
    onClickEarth({ lat, lon });
  };

  return (
    <mesh ref={earthRef} onPointerDown={handlePointerDown}>
      <sphereGeometry args={[3.5, 64, 64]} />
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
  const dispatch = useDispatch();
  const { weatherInfo, weatherLocalInfo } = useSelector(
    (state) => state.weatherReducer
  );

  const apiKey = "129796c288d562d3a9ef920c68ee1612";

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        fetchWeatherByCoords({ lat, lon });
      },
      (error) => {
        toast.error("Geolokatsiyani olishda xatolik: " + error.message);
      }
    );
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const toggleTheme = () => setDarkMode((prev) => !prev);

  const formatWeatherData = (data) => {
    const daily = data.list.filter((item, index) => index % 8 === 0);
    return daily.map((day) => ({
      date: day.dt_txt.split(" ")[0],
      temp: day.main.temp,
      desc: day.weather[0].description,
    }));
  };

  const getWeekDay = (dateStr) => {
    const days = [
      "Yakshanba",
      "Dushanba",
      "Seshanba",
      "Chorshanba",
      "Payshanba",
      "Juma",
      "Shanba",
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
        `Ob-havo ma'lumotlarini olishda xatolik: ${
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
      toast.error("Iltimos, shahar nomini kiriting");
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
        `Shahar bo‘yicha ma’lumotda xatolik: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen relative bg-[#0EA5E9] dark:bg-[#0b1c2c] transition-colors">
      {/* Navbar */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-r from-[#0EA5E9]/80 to-blue-600/80 dark:from-gray-900 dark:to-gray-800 backdrop-blur-md p-4 flex items-center justify-between shadow-xl rounded-b-2xl border-b border-white/20">
        <div
          onClick={() => window.location.reload()}
          className="font-extrabold cursor-pointer select-none text-2xl text-white tracking-wide drop-shadow-sm"
        >
          ☁️ Weather App
        </div>
        <div className="flex items-center gap-4">
          <form
            onSubmit={fetchWeatherByCity}
            className="flex items-center gap-3"
          >
            <Input
              type="text"
              placeholder="Shahar yoki davlat nomini kiriting"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-[270px] px-4 py-2 rounded-lg text-sm font-medium bg-white/80 dark:bg-gray-700 text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-300 focus:ring-2 focus:ring-blue-300 focus:outline-none"
            />
            <Button
              type="submit"
              className="bg-white cursor-pointer text-blue-600 hover:bg-blue-100 dark:bg-gray-100 dark:text-blue-700 dark:hover:bg-gray-200 font-semibold px-4 py-2 rounded-lg shadow"
            >
              Qidirish
            </Button>
          </form>
          <Button
            onClick={toggleTheme}
            variant="ghost"
            className="bg-white/30 cursor-pointer hover:bg-white/50 dark:bg-gray-700 dark:hover:bg-gray-600 text-white dark:text-white p-2 rounded-full transition-colors duration-300"
          >
            {darkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <MoonIcon className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="absolute bottom-4 left-4 right-4 z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton
              key={i}
              className="h-[130px] rounded-2xl bg-white/30 dark:bg-gray-700"
            />
          ))}
        </div>
      )}

      {!loading && weatherLocalInfo && (
        <Card
          onClick={() =>
            navigate("/locationWeatherInfo", {
              state: { weatherData: weatherLocalInfo },
            })
          }
          className="absolute select-none top-24 left-4 z-20 bg-gradient-to-br from-[#0EA5E9]/90 to-blue-600/90 dark:from-gray-800 dark:to-gray-900 text-white dark:text-white border-none shadow-2xl rounded-2xl w-[240px] backdrop-blur-md"
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold tracking-wide flex items-center gap-1">
              {weatherLocalInfo.city.name || "Nomaʼlum joy"}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-col items-start space-y-1">
              <p className="text-4xl font-bold">
                {weatherLocalInfo.list[0].main.temp}°C
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Earth 3D */}
      <Canvas camera={{ position: [0, 0, 8] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 0, 5]} intensity={1} />
        <Stars radius={100} depth={50} count={5000} factor={4} />
        <OrbitControls enableZoom={false} enablePan={false} />
        <EarthSphere onClickEarth={fetchWeatherByCoords} />
      </Canvas>

      {/* Weather Cards */}
      {!loading && weatherInfo.length > 0 && (
        <div className="absolute bottom-4 left-4 right-4 z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4">
          {weatherInfo.map((item, i) => (
            <Card
              key={i}
              className="bg-gradient-to-br select-none from-[#0EA5E9]/90 to-blue-500/90 dark:from-gray-800 dark:to-gray-900 text-white dark:text-white border-none shadow-2xl rounded-2xl hover:scale-105 transition-transform duration-300"
            >
              <CardHeader className="pb-1">
                <CardTitle className="text-lg font-bold tracking-wide">
                  {getWeekDay(item.date)}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-col items-center space-y-2">
                  <div className="text-4xl font-semibold">{item.temp}°C</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
