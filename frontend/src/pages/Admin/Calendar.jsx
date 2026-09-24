// frontend/src/pages/Admin/Calendar.jsx

import React from 'react';

const Calendar = () => {
  const today = new Date();
  const monthName = today.toLocaleString('default', { month: 'long' });
  const year = today.getFullYear();
  const daysInMonth = new Date(year, today.getMonth() + 1, 0).getDate();
  const firstDay = new Date(year, today.getMonth(), 1).getDay();

  const getEventsForDay = (day) => {
    const events = [];

    // Events only on specific days
    const eventMap = {
      1: ['Cloud Migration', 'Team Meeting'],
      15: ['Team Standup', 'Project Update', 'Client Demo'],
      25: ['Performance Review', 'Sprint Retrospective'],
    };

    if (eventMap[day]) {
      events.push(...eventMap[day]);
    }

    return events;
  };

  return (
    <div style={{ padding: '16px 24px 24px 24px' }}>
      <div style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #E8F4E9' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#05620C' }}>
            {monthName} {year}
          </h3>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button style={{ padding: '4px 12px', borderRadius: '6px', border: '1px solid #E8F4E9', background: 'white', cursor: 'pointer', fontSize: '13px' }}>◀</button>
            <button style={{ padding: '4px 12px', borderRadius: '6px', border: 'none', background: '#05620C', color: 'white', cursor: 'pointer', fontSize: '13px' }}>Today</button>
            <button style={{ padding: '4px 12px', borderRadius: '6px', border: '1px solid #E8F4E9', background: 'white', cursor: 'pointer', fontSize: '13px' }}>▶</button>
            <span style={{ marginLeft: '8px', fontSize: '13px', fontWeight: '500', color: '#6B7280' }}>Month</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} style={{ textAlign: 'center', padding: '8px', fontSize: '12px', fontWeight: '600', color: '#6B7280' }}>
              {day}
            </div>
          ))}
          {Array.from({ length: firstDay }, (_, i) => (
            <div key={`empty-${i}`} style={{ padding: '8px', border: '1px solid #E8F4E9', borderRadius: '4px' }}></div>
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const isToday = day === today.getDate();
            const dayEvents = getEventsForDay(day);
            const hasEvent = dayEvents.length > 0;

            return (
              <div
                key={day}
                style={{
                  padding: '6px',
                  border: '1px solid #E8F4E9',
                  borderRadius: '4px',
                  background: isToday ? '#05620C' : hasEvent ? '#E8F4E9' : 'transparent',
                  color: isToday ? 'white' : '#1F2937',
                  fontWeight: isToday ? '600' : 'normal',
                  cursor: 'pointer',
                  minHeight: '65px',
                  position: 'relative',
                }}
              >
                <span style={{ fontWeight: isToday ? '700' : 'normal' }}>{day}</span>
                {hasEvent && (
                  <div style={{ marginTop: '2px' }}>
                    {dayEvents.slice(0, 2).map((event, idx) => (
                      <div
                        key={idx}
                        style={{
                          fontSize: '8px',
                          background: isToday ? 'rgba(255,255,255,0.2)' : '#05620C',
                          color: isToday ? 'white' : 'white',
                          padding: '1px 4px',
                          borderRadius: '3px',
                          marginTop: '2px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {event}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div style={{ fontSize: '7px', color: isToday ? 'rgba(255,255,255,0.7)' : '#6B7280', marginTop: '1px' }}>
                        +{dayEvents.length - 2} more
                      </div>
                    )}
                  </div>
                )}
                {isToday && (
                  <div style={{ fontSize: '7px', color: '#96AF25', marginTop: '2px', fontWeight: '600' }}>
                    Today
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Calendar;