import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Calendar, Clock, Check, AlertCircle, RefreshCw, Tag, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function BookAppointment() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const preselectedServiceId = searchParams.get('serviceId') || '';
  const preselectedPromoCode = searchParams.get('promoCode') || '';

  const [services, setServices] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState(preselectedServiceId);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [notes, setNotes] = useState('');
  const [promoCode, setPromoCode] = useState(preselectedPromoCode);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoAppliedMessage, setPromoAppliedMessage] = useState('');

  // Routine toggle state
  const [isMonthlyRoutine, setIsMonthlyRoutine] = useState(false);
  const [frequencyDays, setFrequencyDays] = useState(30);

  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    if (date) {
      fetchAvailableSlots(date);
    }
  }, [date]);

  useEffect(() => {
    if (preselectedPromoCode) {
      verifyPromoCode(preselectedPromoCode);
    }
  }, [preselectedPromoCode]);

  const fetchServices = async () => {
    try {
      const res = await axios.get('/api/services?activeOnly=true');
      setServices(res.data);
      if (!selectedServiceId && res.data.length > 0) {
        setSelectedServiceId(res.data[0]._id);
      }
    } catch (err) {
      console.error('Error loading services:', err);
    }
  };

  const fetchAvailableSlots = async (selectedDate) => {
    try {
      setLoadingSlots(true);
      setSelectedSlot('');
      const res = await axios.get(`/api/appointments/available-slots?date=${selectedDate}`);
      setTimeSlots(res.data.slots || []);
    } catch (err) {
      console.error('Error checking available slots:', err);
    } finally {
      setLoadingSlots(false);
    }
  };

  const verifyPromoCode = async (codeToVerify) => {
    const code = codeToVerify || promoCode;
    if (!code) return;
    try {
      const res = await axios.get('/api/offers');
      const found = res.data.find((o) => o.promoCode.toUpperCase() === code.toUpperCase());
      if (found) {
        setDiscountPercent(found.discountPercent);
        setPromoAppliedMessage(`✓ ${found.discountPercent}% Discount Applied (${found.title})`);
      } else {
        setDiscountPercent(0);
        setPromoAppliedMessage('Invalid or expired promo code.');
      }
    } catch (err) {
      setDiscountPercent(0);
      setPromoAppliedMessage('Could not verify promo code.');
    }
  };

  const selectedServiceObj = services.find((s) => s._id === selectedServiceId);
  const originalPrice = selectedServiceObj ? selectedServiceObj.price : 0;
  const discountAmount = (originalPrice * discountPercent) / 100;
  const finalPrice = originalPrice - discountAmount;

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!user) {
      navigate('/login');
      return;
    }

    if (!selectedServiceId) {
      setError('Please select a salon service');
      return;
    }

    if (!selectedSlot) {
      setError('Please choose an available time slot for your appointment');
      return;
    }

    try {
      setSubmitting(true);
      await axios.post('/api/appointments/book', {
        serviceId: selectedServiceId,
        date,
        timeSlot: selectedSlot,
        notes,
        promoCode,
        isMonthlyRoutine,
        frequencyDays: isMonthlyRoutine ? frequencyDays : 30,
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error booking appointment. Slot may be taken.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-10 h-10 rounded-full gold-gradient-bg flex items-center justify-center text-white mx-auto shadow-md">
          <Calendar className="w-5 h-5" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-bronze">
          Book Your <span className="gold-gradient-text italic font-normal">Luxury Session</span>
        </h1>
        <p className="text-xs sm:text-sm text-bronze/70">
          Guaranteed slot availability • Instant discount application • Automated routine option
        </p>
      </div>

      {success ? (
        <div className="bg-white rounded-3xl p-10 border border-gold/30 shadow-glass text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-bronze">Appointment Booked Successfully!</h2>
          <p className="text-xs text-warm-gray">
            Your appointment has been recorded. Redirecting you to your personal Customer Dashboard...
          </p>
        </div>
      ) : (
        <form onSubmit={handleBookingSubmit} className="space-y-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-4 rounded-2xl flex items-center gap-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left 2 Columns: Booking Form Inputs */}
            <div className="md:col-span-2 space-y-6">
              {/* Step 1: Select Service */}
              <div className="bg-white p-6 rounded-3xl border border-gold/20 shadow-sm space-y-4">
                <h3 className="font-serif text-lg font-bold text-bronze flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full gold-gradient-bg text-white text-xs flex items-center justify-center font-sans font-bold">1</span>
                  Select Beauty Service
                </h3>

                <select
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                  className="w-full bg-cream/50 p-3 rounded-2xl border border-gold/30 text-xs font-medium text-bronze focus:outline-none focus:ring-2 focus:ring-gold"
                >
                  {services.map((s) => (
                    <option key={s._id} value={s._id}>
                      [{s.category}] {s.name} — ₹{s.price} ({s.duration} mins)
                    </option>
                  ))}
                </select>

                {/* Monthly Care Routine Toggle */}
                <div className="p-4 bg-blush/60 rounded-2xl border border-gold/20 space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isMonthlyRoutine}
                      onChange={(e) => setIsMonthlyRoutine(e.target.checked)}
                      className="w-4 h-4 text-gold rounded border-gold/40 focus:ring-gold"
                    />
                    <span className="text-xs font-bold text-bronze flex items-center gap-1.5">
                      <RefreshCw className="w-3.5 h-3.5 text-gold" /> Set as My Recurring Beauty Routine
                    </span>
                  </label>

                  {isMonthlyRoutine && (
                    <div className="pt-2 pl-7 space-y-2">
                      <label className="text-[11px] font-semibold text-warm-gray block">
                        Reminder Frequency:
                      </label>
                      <div className="flex items-center gap-3">
                        {[30, 45, 60].map((days) => (
                          <button
                            key={days}
                            type="button"
                            onClick={() => setFrequencyDays(days)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                              frequencyDays === days
                                ? 'gold-gradient-bg text-white shadow-xs'
                                : 'bg-white border border-gold/30 text-bronze'
                            }`}
                          >
                            Every {days} Days
                          </button>
                        ))}
                      </div>
                      <p className="text-[10px] text-warm-gray italic">
                        Our cron service will automatically check and send you a beauty reminder email when your ritual is due!
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Step 2: Date & Slot Selector */}
              <div className="bg-white p-6 rounded-3xl border border-gold/20 shadow-sm space-y-4">
                <h3 className="font-serif text-lg font-bold text-bronze flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full gold-gradient-bg text-white text-xs flex items-center justify-center font-sans font-bold">2</span>
                  Choose Date & Time Slot
                </h3>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-bronze">Appointment Date</label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-cream/50 p-3 rounded-2xl border border-gold/30 text-xs text-bronze focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>

                <div className="space-y-2 pt-2">
                  <label className="text-xs font-semibold text-bronze flex items-center justify-between">
                    <span>Available Salon Slots</span>
                    {loadingSlots && <span className="text-[10px] text-gold font-normal">Checking slots...</span>}
                  </label>

                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {timeSlots.map((item) => (
                      <button
                        key={item.slot}
                        type="button"
                        disabled={item.isBooked}
                        onClick={() => setSelectedSlot(item.slot)}
                        className={`py-2 px-2 rounded-xl text-xs font-bold border transition ${
                          item.isBooked
                            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed line-through'
                            : selectedSlot === item.slot
                            ? 'gold-gradient-bg text-white border-gold shadow-md'
                            : 'bg-white text-bronze border-gold/30 hover:border-gold hover:bg-blush'
                        }`}
                      >
                        {item.slot}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Step 3: Promo & Notes */}
              <div className="bg-white p-6 rounded-3xl border border-gold/20 shadow-sm space-y-4">
                <h3 className="font-serif text-lg font-bold text-bronze flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full gold-gradient-bg text-white text-xs flex items-center justify-center font-sans font-bold">3</span>
                  Promo Code & Special Notes
                </h3>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-bronze">Have a Promo Code?</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. GLOW20"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      className="flex-1 bg-cream/50 px-3 py-2.5 rounded-xl border border-gold/30 text-xs font-mono text-bronze focus:outline-none focus:ring-2 focus:ring-gold"
                    />
                    <button
                      type="button"
                      onClick={() => verifyPromoCode()}
                      className="bg-bronze text-cream px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-bronze/90 transition"
                    >
                      Apply
                    </button>
                  </div>
                  {promoAppliedMessage && (
                    <p className={`text-[11px] ${discountPercent > 0 ? 'text-emerald-700 font-semibold' : 'text-red-600'}`}>
                      {promoAppliedMessage}
                    </p>
                  )}
                </div>

                <div className="space-y-1 pt-2">
                  <label className="text-xs font-semibold text-bronze">Notes or Skin Preferences (Optional)</label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Sensitive skin, allergic to specific oils, preferred esthetician..."
                    className="w-full bg-cream/50 p-3 rounded-2xl border border-gold/30 text-xs text-bronze focus:outline-none focus:ring-2 focus:ring-gold"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary Card */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-gold/30 shadow-glass sticky top-24 space-y-6">
                <h3 className="font-serif text-xl font-bold text-bronze border-b border-gold/20 pb-3">
                  Booking Summary
                </h3>

                {selectedServiceObj ? (
                  <div className="space-y-4 text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-gold block">Selected Ritual</span>
                      <h4 className="font-serif font-bold text-base text-bronze">{selectedServiceObj.name}</h4>
                      <p className="text-[11px] text-warm-gray">{selectedServiceObj.category} • {selectedServiceObj.duration} Mins</p>
                    </div>

                    <div className="space-y-2 border-t border-b border-gold/15 py-3">
                      <div className="flex justify-between text-bronze">
                        <span>Date</span>
                        <span className="font-bold">{date}</span>
                      </div>
                      <div className="flex justify-between text-bronze">
                        <span>Time Slot</span>
                        <span className="font-bold">{selectedSlot || 'Not Selected'}</span>
                      </div>
                      <div className="flex justify-between text-bronze">
                        <span>Care Routine</span>
                        <span className="font-bold text-gold-dark">{isMonthlyRoutine ? `Every ${frequencyDays} Days` : 'One-Time'}</span>
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <div className="flex justify-between text-bronze">
                        <span>Service Fee</span>
                        <span>₹{originalPrice}</span>
                      </div>
                      {discountAmount > 0 && (
                        <div className="flex justify-between text-emerald-700 font-semibold">
                          <span>Promo Discount</span>
                          <span>-₹{discountAmount}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-base font-bold text-bronze pt-2 border-t border-gold/20">
                        <span>Total Payable</span>
                        <span className="font-serif text-xl text-gold-dark">₹{finalPrice}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-warm-gray">Select a service to view summary.</p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full gold-gradient-bg text-white py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider shadow-luxury hover:opacity-95 transition flex items-center justify-center gap-2"
                >
                  {submitting ? 'Confirming Booking...' : 'Confirm Appointment'}
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
