import { useState } from 'react';
import {
  Home,
  MapPin,
  Bed,
  Bath,
  Car,
  Layers,
  Wind,
  Flame,
  Warehouse,
  CheckCircle2,
  AlertCircle,
  DollarSign,
  Loader2
} from 'lucide-react';

function App() {
  const [formData, setFormData] = useState({
    area: 4000,
    bedrooms: 3,
    bathrooms: 2,
    stories: 2,
    parking: 1,
    mainroad: true,
    basement: false,
    hotwaterheating: false,
    airconditioning: true,
    prefarea: false
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : Number(value)
    }));
  };

  const handleToggle = (name) => {
    setFormData(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    // Transform boolean to 0/1 for API
    const payload = {
      ...formData,
      mainroad: formData.mainroad ? 1 : 0,
      basement: formData.basement ? 1 : 0,
      hotwaterheating: formData.hotwaterheating ? 1 : 0,
      airconditioning: formData.airconditioning ? 1 : 0,
      prefarea: formData.prefarea ? 1 : 0,
    };

    try {
      // Use relative path for production (Vercel rewrites)
      // Or fallback to localhost for local dev if not proxied
      const apiUrl = import.meta.env.PROD ? '/predict' : 'http://localhost:8000/predict';

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch prediction');
      }

      const data = await response.json();
      setResult(data.prediction_price);
    } catch (err) {
      console.error(err);
      setError('Could not connect to the prediction API. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200">
              <Home className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
            House Price Predictor
          </h1>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Enter the details of your property below to get an instant AI-powered valuation estimate based on current market trends.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
              <div className="p-6 sm:p-8">
                <form onSubmit={handleSubmit} className="space-y-8">

                  {/* Key Features Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2 mb-6">
                      <Layers className="w-5 h-5 text-indigo-500" />
                      Property Details
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                      <InputField
                        label="Area (sq ft)"
                        name="area"
                        value={formData.area}
                        onChange={handleChange}
                        icon={<MapPin className="w-4 h-4" />}
                        min="0"
                        step="5"
                      />

                      <InputField
                        label="Stories"
                        name="stories"
                        value={formData.stories}
                        onChange={handleChange}
                        icon={<Layers className="w-4 h-4" />}
                        min="1"
                        max="5"
                      />

                      <CounterInput
                        label="Bedrooms"
                        name="bedrooms"
                        value={formData.bedrooms}
                        onChange={handleChange}
                        icon={<Bed className="w-4 h-4" />}
                      />

                      <CounterInput
                        label="Bathrooms"
                        name="bathrooms"
                        value={formData.bathrooms}
                        onChange={handleChange}
                        icon={<Bath className="w-4 h-4" />}
                      />

                      <CounterInput
                        label="Parking Spots"
                        name="parking"
                        value={formData.parking}
                        onChange={handleChange}
                        icon={<Car className="w-4 h-4" />}
                      />

                    </div>
                  </div>

                  <div className="border-t border-slate-100 my-8"></div>

                  {/* Amenities Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2 mb-6">
                      <CheckCircle2 className="w-5 h-5 text-indigo-500" />
                      Amenities & Features
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Toggle
                        label="Main Road Access"
                        name="mainroad"
                        checked={formData.mainroad}
                        onChange={() => handleToggle('mainroad')}
                        icon={<MapPin className="w-4 h-4" />}
                      />
                      <Toggle
                        label="Basement"
                        name="basement"
                        checked={formData.basement}
                        onChange={() => handleToggle('basement')}
                        icon={<Warehouse className="w-4 h-4" />}
                      />
                      <Toggle
                        label="Hot Water Heating"
                        name="hotwaterheating"
                        checked={formData.hotwaterheating}
                        onChange={() => handleToggle('hotwaterheating')}
                        icon={<Flame className="w-4 h-4" />}
                      />
                      <Toggle
                        label="Air Conditioning"
                        name="airconditioning"
                        checked={formData.airconditioning}
                        onChange={() => handleToggle('airconditioning')}
                        icon={<Wind className="w-4 h-4" />}
                      />
                      <Toggle
                        label="Preferred Area"
                        name="prefarea"
                        checked={formData.prefarea}
                        onChange={() => handleToggle('prefarea')}
                        icon={<CheckCircle2 className="w-4 h-4" />}
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Calculating Valuation...
                        </>
                      ) : (
                        <>
                          Calculate Price
                          <DollarSign className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Results Side */}
          <div className="lg:col-span-1">

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div className={`bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden transition-all duration-500 h-full flex flex-col ${result ? 'ring-2 ring-indigo-500 ring-offset-2' : ''}`}>
              <div className="bg-slate-900 p-6 text-white text-center">
                <h3 className="text-lg font-medium opacity-90">Estimated Valuation</h3>
              </div>

              <div className="p-8 flex-1 flex flex-col justify-center items-center text-center">
                {result ? (
                  <div className="animate-in fade-in zoom-in duration-500">
                    <div className="text-sm text-slate-500 font-medium tracking-wider uppercase mb-2">Property Value</div>
                    <div className="text-4xl sm:text-5xl font-bold text-indigo-600 tracking-tight mb-2">
                      {formatCurrency(result)}
                    </div>
                    <div className="text-slate-400 text-sm">
                      * This is an AI-generated estimate based on the features provided.
                    </div>
                  </div>
                ) : (
                  <div className="text-slate-400">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <DollarSign className="w-8 h-8 text-slate-300" />
                    </div>
                    <p>Submit the form to see the predicted price here.</p>
                  </div>
                )}
              </div>

              {/* Decorative bottom */}
              <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable Components

function InputField({ label, name, value, onChange, icon, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
          {icon}
        </div>
        <input
          type="number"
          name={name}
          value={value}
          onChange={onChange}
          className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-lg leading-5 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 sm:text-sm"
          {...props}
        />
      </div>
    </div>
  );
}

function CounterInput({ label, name, value, onChange, icon }) {
  const increment = () => {
    onChange({ target: { name, value: Number(value) + 1, type: 'number' } });
  };
  const decrement = () => {
    if (value > 0) {
      onChange({ target: { name, value: Number(value) - 1, type: 'number' } });
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
      <div className="flex items-center">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            {icon}
          </div>
          <input
            type="number"
            name={name}
            value={value}
            onChange={onChange}
            className="block w-full pl-10 pr-12 py-3 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all sm:text-sm"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-1 gap-1">
            <button
              type="button"
              onClick={decrement}
              className="p-1 hover:bg-slate-200 rounded text-slate-500 hover:text-indigo-600 transition-colors"
            >
              -
            </button>
            <button
              type="button"
              onClick={increment}
              className="p-1 hover:bg-slate-200 rounded text-slate-500 hover:text-indigo-600 transition-colors"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Toggle({ label, checked, onChange, icon }) {
  return (
    <div
      onClick={onChange}
      className={`
        relative flex items-center justify-between p-4 rounded-xl cursor-pointer border transition-all duration-200
        ${checked ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-slate-200 hover:bg-slate-50'}
      `}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-full ${checked ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
          {icon}
        </div>
        <span className={`text-sm font-medium ${checked ? 'text-indigo-900' : 'text-slate-700'}`}>
          {label}
        </span>
      </div>

      <div className={`
        w-11 h-6 rounded-full transition-colors duration-200 ease-in-out relative
        ${checked ? 'bg-indigo-600' : 'bg-slate-200'}
      `}>
        <span className={`
          block w-5 h-5 bg-white rounded-full shadow transform ring-0 transition-transform duration-200 ease-in-out mt-0.5 ml-0.5
          ${checked ? 'translate-x-5' : 'translate-x-0'}
        `} />
      </div>
    </div>
  );
}

export default App;
