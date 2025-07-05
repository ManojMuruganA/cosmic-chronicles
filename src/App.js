import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { CalendarDays, Rocket } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { motion } from 'framer-motion';

const fetchEventData = async (month, day) => {
  const url = `https://en.wikipedia.org/api/rest_v1/feed/onthisday/events/${month}/${day}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.events.filter((e) =>
    e.text.toLowerCase().includes('nasa') ||
    e.text.toLowerCase().includes('space') ||
    e.text.toLowerCase().includes('launch') ||
    e.text.toLowerCase().includes('astronaut') ||
    e.text.toLowerCase().includes('isro') ||
    e.text.toLowerCase().includes('esa')
  );
};

function App() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    setLoading(true);
    fetchEventData(selectedDate.getMonth() + 1, selectedDate.getDate()).then(events => {
      setEvents(events);
      setLoading(false);
    });
  }, [selectedDate]);

  const filteredEvents = events.filter(event =>
    filter === 'all' || event.text.toLowerCase().includes(filter)
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-indigo-900 to-black text-white p-4">
      <section className="max-w-4xl mx-auto">
        <header className="text-center my-10">
          <h1 className="text-4xl font-bold mb-2 flex justify-center items-center gap-2">
            <Rocket className="text-yellow-400" /> Cosmic Chronicles
          </h1>
          <p className="text-lg text-gray-300">
            Discover astronomical events that happened on this day in history.
          </p>
        </header>

        {/* Date Picker & Filter */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="MMMM d"
            className="p-2 rounded text-black text-center"
          />
          <select
            className="p-2 rounded bg-indigo-900 text-white"
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Agencies</option>
            <option value="nasa">NASA</option>
            <option value="isro">ISRO</option>
            <option value="esa">ESA</option>
          </select>
        </div>

        {/* Events List */}
        {loading ? (
          <p className="text-center text-lg text-gray-400 animate-pulse">Loading space history...</p>
        ) : (
          <div className="space-y-6">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="border border-indigo-500 rounded-xl p-4 bg-indigo-950/60 shadow-md hover:scale-[1.02] transition"
                >
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <CalendarDays className="text-pink-400" /> {event.year}
                  </h2>
                  <p className="mt-2 text-gray-200">{event.text}</p>
                  {event.pages?.[0]?.thumbnail?.source && (
                    <img
                      src={event.pages[0].thumbnail.source}
                      alt="event thumbnail"
                      className="mt-4 rounded-lg w-full max-h-60 object-cover border border-gray-600"
                    />
                  )}
                </motion.div>
              ))
            ) : (
              <p className="text-center text-red-400">No matching space events found.</p>
            )}
          </div>
        )}

        {/* Footer */}
        <footer className="mt-20 text-center text-sm text-gray-500">
          <p>
            Built with ❤️ for Astralweb Innovate A'25 Hackathon — {format(new Date(), 'MMMM do, yyyy')}
          </p>
        </footer>
      </section>
    </main>
  );
}

export default App;
