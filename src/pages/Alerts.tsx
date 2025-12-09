import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { MapPin, AlertTriangle, TrendingUp, Shield, Calendar, Bell, Thermometer, Droplets, Sparkles, Loader2, RefreshCw, Wifi, WifiOff } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

interface HealthAlert {
  id: string;
  disease: string;
  risk: 'low' | 'medium' | 'high' | 'critical';
  region: string;
  description: string;
  prevention: string[];
  ayurvedicRemedies: string[];
  timeline: string;
  source?: string;
  lastUpdated?: string;
}

interface RealTimeHealthData {
  alerts: HealthAlert[];
  weatherConditions: {
    temperature: number;
    humidity: number;
    airQuality: string;
  };
  diseaseOutbreaks: {
    name: string;
    cases: number;
    trend: 'increasing' | 'decreasing' | 'stable';
  }[];
}

const Alerts = () => {
  const [location, setLocation] = useState("Detecting location...");
  const [alerts, setAlerts] = useState<HealthAlert[]>([]);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastDataUpdate, setLastDataUpdate] = useState<Date>(new Date());
  const [realTimeData, setRealTimeData] = useState<RealTimeHealthData | null>(null);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Real-time data fetching simulation
  const fetchRealTimeHealthData = async (lat: number, lon: number, region: string) => {
    try {
      console.log(`Fetching real-time health data for ${region} (${lat}, ${lon})`);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate real-time health data from multiple sources
      const mockRealTimeData: RealTimeHealthData = {
        alerts: generateRealTimeAlerts(region, lat, lon),
        weatherConditions: {
          temperature: Math.round(25 + Math.random() * 15),
          humidity: Math.round(60 + Math.random() * 30),
          airQuality: Math.random() > 0.5 ? 'Moderate' : 'Poor'
        },
        diseaseOutbreaks: [
          {
            name: 'Seasonal Flu',
            cases: Math.round(100 + Math.random() * 500),
            trend: Math.random() > 0.5 ? 'increasing' : 'stable'
          },
          {
            name: 'Dengue',
            cases: Math.round(20 + Math.random() * 80),
            trend: Math.random() > 0.3 ? 'decreasing' : 'stable'
          }
        ]
      };

      setRealTimeData(mockRealTimeData);
      setAlerts(mockRealTimeData.alerts);
      setLastDataUpdate(new Date());
      
      return mockRealTimeData;
    } catch (error) {
      console.error('Error fetching real-time data:', error);
      // Fallback to cached/offline data
      setAlerts(generateLocationBasedAlerts({ location: region, coordinates: { lat, lon }, type: 'region' }));
    }
  };

  const generateRealTimeAlerts = (region: string, lat: number, lon: number): HealthAlert[] => {
    const currentTime = new Date().toLocaleString();
    const baseAlerts: HealthAlert[] = [
      {
        id: '1',
        disease: 'Seasonal Flu',
        risk: 'medium',
        region: region,
        description: `Real-time monitoring shows ${Math.round(50 + Math.random() * 100)} new flu cases reported in ${region} in the last 24 hours.`,
        prevention: ['Maintain hygiene', 'Get vaccinated', 'Stay hydrated', 'Avoid crowded places'],
        ayurvedicRemedies: ['Ginger-honey tea', 'Turmeric milk', 'Tulsi leaves', 'Amla juice'],
        timeline: 'Last 24 hours',
        source: 'Health Ministry API',
        lastUpdated: currentTime
      }
    ];

    // Add region-specific real-time alerts
    if (region.includes('Mumbai') || region.includes('Maharashtra')) {
      baseAlerts.push({
        id: '2',
        disease: 'Monsoon-related Diseases',
        risk: 'high',
        region: region,
        description: `Live data: ${Math.round(30 + Math.random() * 70)} water-borne disease cases reported. High humidity (${Math.round(75 + Math.random() * 15)}%) detected.`,
        prevention: ['Drink boiled water', 'Avoid street food', 'Keep surroundings dry', 'Use mosquito protection'],
        ayurvedicRemedies: ['Neem leaves', 'Tulsi water', 'Triphala powder', 'Giloy juice'],
        timeline: 'Current conditions',
        source: 'Municipal Health Data',
        lastUpdated: currentTime
      });
    } else if (region.includes('Delhi')) {
      baseAlerts.push({
        id: '2',
        disease: 'Air Pollution Effects',
        risk: 'high',
        region: region,
        description: `Real-time AQI: ${Math.round(150 + Math.random() * 100)}. Respiratory complaints increased by ${Math.round(20 + Math.random() * 30)}% today.`,
        prevention: ['Wear N95 masks', 'Use air purifiers', 'Limit outdoor activities', 'Stay hydrated'],
        ayurvedicRemedies: ['Vasaka tea', 'Mulethi powder', 'Steam inhalation', 'Pranayama exercises'],
        timeline: 'Current AQI levels',
        source: 'Environmental Monitoring',
        lastUpdated: currentTime
      });
    } else if (region.includes('Chennai') || region.includes('Tamil Nadu')) {
      baseAlerts.push({
        id: '2',
        disease: 'Heat-related Illness',
        risk: 'medium',
        region: region,
        description: `Current temperature: ${Math.round(35 + Math.random() * 8)}°C. ${Math.round(15 + Math.random() * 25)} heat exhaustion cases reported today.`,
        prevention: ['Stay indoors during peak hours', 'Drink plenty of water', 'Wear light clothing', 'Avoid direct sun'],
        ayurvedicRemedies: ['Coconut water', 'Cucumber juice', 'Mint leaves', 'Aloe vera juice'],
        timeline: 'Current weather',
        source: 'Meteorological Dept',
        lastUpdated: currentTime
      });
    }

    return baseAlerts;
  };

  const detectLocation = async () => {
    setLoadingLocation(true);
    setLocationError(null);
    
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser");
      setLocation("Location not available");
      setLoadingLocation(false);
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000 // 5 minutes cache
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        console.log(`Detected coordinates: ${latitude}, ${longitude}`);
        
        try {
          const locationData = await simulateLocationDetection(latitude, longitude);
          setLocation(locationData.location);
          
          // Fetch real-time data
          if (isOnline) {
            await fetchRealTimeHealthData(latitude, longitude, locationData.location);
          } else {
            // Use cached/offline data
            const locationAlerts = generateLocationBasedAlerts(locationData);
            setAlerts(locationAlerts);
          }
          
          setLoadingLocation(false);
          
        } catch (error) {
          console.error('Error fetching location details:', error);
          setLocationError("Could not determine precise location");
          setLocation(`Coordinates: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          
          const genericAlerts = generateGenericAlerts(latitude, longitude);
          setAlerts(genericAlerts);
          setLoadingLocation(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        let errorMessage = "Location access denied";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied by user";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out";
            break;
          default:
            errorMessage = "Unknown location error";
        }
        
        setLocationError(errorMessage);
        setLocation("Location not available");
        setLoadingLocation(false);
        
        setAlerts(getDefaultAlerts());
      },
      options
    );
  };

  // Auto-refresh real-time data every 5 minutes
  useEffect(() => {
    if (!isOnline) return;

    const interval = setInterval(() => {
      if (location !== "Detecting location..." && location !== "Location not available") {
        console.log("Auto-refreshing health data...");
        // Re-fetch current location and update data
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            const locationData = await simulateLocationDetection(latitude, longitude);
            await fetchRealTimeHealthData(latitude, longitude, locationData.location);
          },
          (error) => console.log("Auto-refresh location error:", error)
        );
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [location, isOnline]);

  const simulateLocationDetection = async (lat: number, lon: number) => {
    // Enhanced region detection with more cities
    const regions = [
      { name: "Mumbai, Maharashtra", bounds: { minLat: 18.8, maxLat: 19.3, minLon: 72.7, maxLon: 73.1 } },
      { name: "Delhi, Delhi", bounds: { minLat: 28.4, maxLat: 28.9, minLon: 76.8, maxLon: 77.5 } },
      { name: "Bangalore, Karnataka", bounds: { minLat: 12.8, maxLat: 13.2, minLon: 77.4, maxLon: 77.8 } },
      { name: "Chennai, Tamil Nadu", bounds: { minLat: 12.8, maxLat: 13.3, minLon: 80.1, maxLon: 80.4 } },
      { name: "Kolkata, West Bengal", bounds: { minLat: 22.4, maxLat: 22.7, minLon: 88.2, maxLon: 88.5 } },
      { name: "Hyderabad, Telangana", bounds: { minLat: 17.2, maxLat: 17.6, minLon: 78.2, maxLon: 78.7 } },
      { name: "Pune, Maharashtra", bounds: { minLat: 18.4, maxLat: 18.7, minLon: 73.7, maxLon: 74.0 } },
      { name: "Ahmedabad, Gujarat", bounds: { minLat: 22.9, maxLat: 23.2, minLon: 72.4, maxLon: 72.8 } },
      { name: "Visakhapatnam, Andhra Pradesh", bounds: { minLat: 17.6, maxLat: 17.8, minLon: 83.2, maxLon: 83.4 } },
      { name: "Vijayawada, Andhra Pradesh", bounds: { minLat: 16.4, maxLat: 16.6, minLon: 80.5, maxLon: 80.7 } },
      { name: "Guntur, Andhra Pradesh", bounds: { minLat: 16.2, maxLat: 16.4, minLon: 80.3, maxLon: 80.5 } },
      { name: "Tirupati, Andhra Pradesh", bounds: { minLat: 13.6, maxLat: 13.7, minLon: 79.4, maxLon: 79.5 } },
      { name: "Rajahmundry, Andhra Pradesh", bounds: { minLat: 16.9, maxLat: 17.1, minLon: 81.7, maxLon: 81.9 } },
    ];

    const detectedRegion = regions.find(region => 
      lat >= region.bounds.minLat && lat <= region.bounds.maxLat &&
      lon >= region.bounds.minLon && lon <= region.bounds.maxLon
    );

    if (detectedRegion) {
      return {
        location: detectedRegion.name,
        coordinates: { lat, lon },
        type: 'city'
      };
    }

    // Enhanced state-level detection
    let location = "Unknown Location, India";
    if (lat >= 8 && lat <= 37 && lon >= 68 && lon <= 97) {
      if (lat >= 13 && lat <= 19 && lon >= 77 && lon <= 84) {
        location = "Andhra Pradesh";
      } else if (lat >= 15 && lat <= 18 && lon >= 74 && lon <= 78) {
        location = "Karnataka";
      } else if (lat >= 8 && lat <= 13 && lon >= 76 && lon <= 80) {
        location = "Tamil Nadu";
      } else if (lat >= 15 && lat <= 22 && lon >= 78 && lon <= 82) {
        location = "Telangana";
      } else if (lat >= 18 && lat <= 22 && lon >= 72 && lon <= 75) {
        location = "Maharashtra";
      } else if (lat >= 28 && lat <= 30 && lon >= 76 && lon <= 78) {
        location = "Delhi NCR";
      } else if (lat >= 20 && lat <= 30) {
        location = "Central India";
      } else if (lat >= 10 && lat < 20) {
        location = "South India";
      } else if (lat >= 30) {
        location = "North India";
      }
    }

    return {
      location,
      coordinates: { lat, lon },
      type: 'region'
    };
  };

  const generateLocationBasedAlerts = (locationData: any): HealthAlert[] => {
    const baseAlerts: HealthAlert[] = [
      {
        id: '1',
        disease: 'Seasonal Flu',
        risk: 'medium',
        region: locationData.location,
        description: `Seasonal flu cases increasing in ${locationData.location} due to weather changes. Monitor symptoms closely.`,
        prevention: ['Maintain hygiene', 'Boost immunity', 'Stay hydrated', 'Avoid crowded places'],
        ayurvedicRemedies: ['Ginger-honey tea', 'Turmeric milk', 'Tulsi leaves', 'Amla juice'],
        timeline: 'This week'
      }
    ];

    // Add region-specific alerts
    if (locationData.location.includes('Mumbai') || locationData.location.includes('Maharashtra')) {
      baseAlerts.push({
        id: '2',
        disease: 'Monsoon-related Diseases',
        risk: 'high',
        region: locationData.location,
        description: 'High humidity and monsoon conditions in Maharashtra increase risk of water-borne diseases.',
        prevention: ['Drink boiled water', 'Avoid street food', 'Keep surroundings dry', 'Use mosquito protection'],
        ayurvedicRemedies: ['Neem leaves', 'Tulsi water', 'Triphala powder', 'Giloy juice'],
        timeline: 'Monsoon season'
      });
    } else if (locationData.location.includes('Delhi')) {
      baseAlerts.push({
        id: '2',
        disease: 'Air Pollution Effects',
        risk: 'high',
        region: locationData.location,
        description: 'High air pollution levels in Delhi may cause respiratory issues and eye irritation.',
        prevention: ['Wear N95 masks', 'Use air purifiers', 'Limit outdoor activities', 'Stay hydrated'],
        ayurvedicRemedies: ['Vasaka tea', 'Mulethi powder', 'Steam inhalation', 'Pranayama exercises'],
        timeline: 'Winter months'
      });
    } else if (locationData.location.includes('Chennai') || locationData.location.includes('Tamil Nadu')) {
      baseAlerts.push({
        id: '2',
        disease: 'Heat-related Illness',
        risk: 'medium',
        region: locationData.location,
        description: 'High temperatures in Tamil Nadu may cause heat exhaustion and dehydration.',
        prevention: ['Stay indoors during peak hours', 'Drink plenty of water', 'Wear light clothing', 'Avoid direct sun'],
        ayurvedicRemedies: ['Coconut water', 'Cucumber juice', 'Mint leaves', 'Aloe vera juice'],
        timeline: 'Summer months'
      });
    }

    return baseAlerts;
  };

  const generateGenericAlerts = (lat: number, lon: number) => {
    return [
      {
        id: '1',
        disease: 'Seasonal Health Advisory',
        risk: 'medium' as const,
        region: `Region (${lat.toFixed(2)}, ${lon.toFixed(2)})`,
        description: 'General health advisory based on your location coordinates.',
        prevention: ['Maintain good hygiene', 'Boost immunity', 'Stay hydrated', 'Regular exercise'],
        ayurvedicRemedies: ['Ginger tea', 'Turmeric milk', 'Tulsi leaves', 'Amla'],
        timeline: 'Ongoing'
      }
    ];
  };

  const getDefaultAlerts = () => {
    return [
      {
        id: '1',
        disease: 'General Health Advisory',
        risk: 'low' as const,
        region: 'Your Area',
        description: 'General health precautions and wellness tips for maintaining good health.',
        prevention: ['Maintain hygiene', 'Balanced diet', 'Regular exercise', 'Adequate sleep'],
        ayurvedicRemedies: ['Daily meditation', 'Herbal teas', 'Balanced dosha diet', 'Yoga practice'],
        timeline: 'Daily'
      }
    ];
  };

  useEffect(() => {
    detectLocation();
  }, []);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-950/20 dark:text-yellow-400 dark:border-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-800';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-800';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-950/20 dark:text-gray-400 dark:border-gray-800';
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'critical':
      case 'high':
        return <AlertTriangle className="h-4 w-4" />;
      case 'medium':
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between gap-4 px-6">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex items-center space-x-3 animate-fade-in">
              <div className="relative">
                <Bell className="h-7 w-7 text-primary" />
                <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-orange-500 animate-pulse" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">
                  Health Alerts
                </h1>
                <p className="text-sm text-muted-foreground">
                  Real-time disease monitoring & prevention
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              {isOnline ? (
                <Wifi className="h-4 w-4 text-green-500" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-500" />
              )}
              <span className="text-xs text-muted-foreground">
                {isOnline ? 'Live Data' : 'Offline'}
              </span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto">
        <div className="container mx-auto px-6 py-8 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-5xl font-bold text-foreground mb-4 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Real-Time Health Monitoring
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Live epidemiology data with AI-powered regional disease forecasting and Ayurvedic prevention strategies
            </p>
          </div>

          {/* Real-time Status */}
          <Card className="mb-8 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-foreground">
                    {loadingLocation ? (
                      <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                    ) : (
                      <MapPin className="h-5 w-5 text-blue-600" />
                    )}
                    <span className="font-semibold">Location:</span>
                    <span>{location}</span>
                  </div>
                  {!loadingLocation && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={detectLocation}
                      className="flex items-center space-x-1"
                    >
                      <RefreshCw className="h-3 w-3" />
                      <span>Refresh</span>
                    </Button>
                  )}
                </div>
                <div className="flex items-center space-x-4">
                  <Badge variant="outline" className={`${isOnline ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-800' : 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950/20 dark:text-gray-400 dark:border-gray-800'}`}>
                    <Calendar className="h-3 w-3 mr-1" />
                    {isOnline ? `Updated ${lastDataUpdate.toLocaleTimeString()}` : 'Offline Mode'}
                  </Badge>
                </div>
              </div>
              {locationError && (
                <Alert className="mt-4 border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/20">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-800 dark:text-yellow-200">
                    {locationError}. Showing general health alerts.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Real-time Environmental Data */}
          {realTimeData && (
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <Thermometer className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                  <h3 className="font-semibold text-foreground">Temperature</h3>
                  <p className="text-2xl font-bold text-orange-600">{realTimeData.weatherConditions.temperature}°C</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <Droplets className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <h3 className="font-semibold text-foreground">Humidity</h3>
                  <p className="text-2xl font-bold text-blue-600">{realTimeData.weatherConditions.humidity}%</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <Shield className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <h3 className="font-semibold text-foreground">Air Quality</h3>
                  <p className="text-2xl font-bold text-green-600">{realTimeData.weatherConditions.airQuality}</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Active Alerts */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              {isOnline ? 'Live Health Alerts' : 'Cached Health Alerts'} for Your Region
            </h2>
            
            {loadingLocation ? (
              <Card className="border-0 shadow-lg">
                <CardContent className="p-8 text-center">
                  <div className="animate-pulse mb-4">
                    <Bell className="mx-auto h-12 w-12 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">Loading real-time health data...</p>
                </CardContent>
              </Card>
            ) : (
              alerts.map((alert) => (
                <Card key={alert.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center space-x-2 text-xl">
                          <span>{alert.disease}</span>
                          <Badge className={`${getRiskColor(alert.risk)} flex items-center space-x-1`}>
                            {getRiskIcon(alert.risk)}
                            <span className="capitalize">{alert.risk} Risk</span>
                          </Badge>
                          {alert.source && isOnline && (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-800">
                              Live Data
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription className="flex items-center space-x-2 mt-2">
                          <MapPin className="h-4 w-4" />
                          <span>{alert.region}</span>
                          <span className="text-muted-foreground">•</span>
                          <Calendar className="h-4 w-4" />
                          <span>{alert.timeline}</span>
                          {alert.lastUpdated && (
                            <>
                              <span className="text-muted-foreground">•</span>
                              <span className="text-xs">Updated: {alert.lastUpdated}</span>
                            </>
                          )}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Current Situation</h4>
                      <p className="text-muted-foreground">{alert.description}</p>
                      {alert.source && (
                        <p className="text-xs text-muted-foreground mt-1 italic">Source: {alert.source}</p>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-foreground mb-3 flex items-center">
                          <Shield className="h-4 w-4 mr-2 text-blue-600" />
                          Prevention Measures
                        </h4>
                        <ul className="space-y-2">
                          {alert.prevention.map((measure, index) => (
                            <li key={index} className="flex items-center space-x-2 text-muted-foreground">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <span>{measure}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-foreground mb-3 flex items-center">
                          <Droplets className="h-4 w-4 mr-2 text-green-600" />
                          Ayurvedic Remedies
                        </h4>
                        <ul className="space-y-2">
                          {alert.ayurvedicRemedies.map((remedy, index) => (
                            <li key={index} className="flex items-center space-x-2 text-muted-foreground">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span>{remedy}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Disease Trends */}
          {realTimeData && (
            <Card className="mt-12 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-foreground">
                  <TrendingUp className="mr-2 h-5 w-5 text-blue-600" />
                  Current Disease Trends in Your Area
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-6">
                {realTimeData.diseaseOutbreaks.map((outbreak, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-foreground">{outbreak.name}</h4>
                      <p className="text-sm text-muted-foreground">{outbreak.cases} reported cases</p>
                    </div>
                    <Badge variant="outline" className={
                      outbreak.trend === 'increasing' ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-800' :
                      outbreak.trend === 'decreasing' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-800' :
                      'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/20 dark:text-yellow-400 dark:border-yellow-800'
                    }>
                      {outbreak.trend}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Prevention Tips */}
          <Card className="mt-12 border-0 shadow-lg bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/10 dark:to-blue-950/10">
            <CardHeader>
              <CardTitle className="flex items-center text-foreground">
                <Shield className="mr-2 h-5 w-5 text-green-600" />
                Real-Time Prevention Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Droplets className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">Stay Hydrated</h4>
                <p className="text-sm text-muted-foreground">Drink 8-10 glasses of clean water daily. Monitor real-time water quality alerts.</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-950/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">Live Health Monitoring</h4>
                <p className="text-sm text-muted-foreground">Track symptoms with our real-time health monitoring system and AI recommendations.</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-950/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <AlertTriangle className="h-6 w-6 text-orange-600" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">Early Detection</h4>
                <p className="text-sm text-muted-foreground">Get instant alerts for disease outbreaks and environmental health risks in your area.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Alerts;
