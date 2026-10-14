// frontend/src/pages/Admin/Calendar.jsx

import React from 'react';

const Calendar = ({ isMobile }) => {
  const today = new Date();
  const monthName = today.toLocaleString('default', { month: 'long' });
  const year = today.getFullYear();
  const daysInMonth = new Date(year, today.getMonth() + 1, 0).getDate();
  const firstDay = new Date(year, today.getMonth(), 1).getDay();

  const eventMap = {
    1: ['Cloud Migration', 'Team Meeting'],
    15: ['Team Standup', 'Project Update', 'Client Demo'],
    25: ['Performance Review', 'Sprint Retrospective'],
  };

  const getEventsForDay = (day) => eventMap[day] || [];

  // For agenda view: collect only days with events
  const daysWithEvents = Object.keys(eventMap)
    .map(Number)
    .sort((a, b) => a - b)
    .map((day) => ({
      day,
      date: new Date(year, today.getMonth(), day),
      events: eventMap[day],
    }));

  return (
    <div style={{ padding: isMobile ? '12px' : '16px 24px 24px 24px', overflowX: 'hidden' }}>
      <div style={{ background: 'white', borderRadius: '12px', padding: isMobile ? '16px' : '20px', border: '1px solid #E8F4E9' }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems: isMobile ? 'stretch' : 'center',
            marginBottom: '16px',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <h3 style={{ fontSize: isMobile ? '16px' : '18px', fontWeight: '600', color: '#05620C', margin: 0 }}>
            {monthName} {year}
          </h3>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', justifyContent: isMobile ? 'space-between' : 'flex-start' }}>
            <button style={{ padding: '4px 12px', borderRadius: '6px', border: '1px solid #E8F4E9', background: 'white', cursor: 'pointer', fontSize: '13px' }}>◀</button>
            <button style={{ padding: '4px 12px', borderRadius: '6px', border: 'none', background: '#05620C', color: 'white', cursor: 'pointer', fontSize: '13px' }}>Today</button>
            <button style={{ padding: '4px 12px', borderRadius: '6px', border: '1px solid #E8F4E9', background: 'white', cursor: 'pointer', fontSize: '13px' }}>▶</button>
          </div>
        </div>

        {/* 7-Column Grid (compact on mobile) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: isMobile ? '1px' : '2px' }}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div
              key={day}
              style={{
                textAlign: 'center',
                padding: isMobile ? '4px 0' : '8px',
                fontSize: isMobile ? '10px' : '12px',
                fontWeight: '600',
                color: '#6B7280',
              }}
            >
              {isMobile ? day.charAt(0) : day}
            </div>
          ))}
          {Array.from({ length: firstDay }, (_, i) => (
            <div
              key={`empty-${i}`}
              style={{ padding: isMobile ? '4px' : '8px', border: '1px solid #E8F4E9', borderRadius: '4px' }}
            ></div>
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
                  padding: isMobile ? '4px' : '6px',
                  border: '1px solid #E8F4E9',
                  borderRadius: '4px',
                  background: isToday ? '#05620C' : hasEvent ? '#E8F4E9' : 'transparent',
                  color: isToday ? 'white' : '#1F2937',
                  fontWeight: isToday ? '600' : 'normal',
                  cursor: 'pointer',
                  minHeight: isMobile ? '40px' : '65px',
                  position: 'relative',
                }}
              >
                <span style={{ fontSize: isMobile ? '11px' : '14px', fontWeight: isToday ? '700' : 'normal' }}>
                  {day}
                </span>
                {hasEvent && !isMobile && (
                  <div style={{ marginTop: '2px' }}>
                    {dayEvents.slice(0, 2).map((event, idx) => (
                      <div
                        key={idx}
                        style={{
                          fontSize: '8px',
                          background: isToday ? 'rgba(255,255,255,0.2)' : '#05620C',
                          color: 'white',
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
                {/* Mobile: show dots instead of event text */}
                {hasEvent && isMobile && (
                  <div style={{ display: 'flex', gap: '2px', marginTop: '4px', justifyContent: 'center' }}>
                    {dayEvents.slice(0, 3).map((_, idx) => (
                      <span
                        key={idx}
                        style={{
                          width: '4px',
                          height: '4px',
                          borderRadius: '50%',
                          background: isToday ? 'white' : '#05620C',
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* MOBILE ONLY: Agenda list below the grid */}
        {isMobile && (
          <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #E8F4E9' }}>
            <h4
              style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#1F2937',
                marginBottom: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#05620C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              This Month's Events
            </h4>

            {daysWithEvents.length === 0 ? (
              <p style={{ fontSize: '13px', color: '#6B7280', textAlign: 'center', padding: '20px 0' }}>
                No events this month.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {daysWithEvents.map(({ day, date, events }) => {
                  const isToday = day === today.getDate();
                  const dayLabel = date.toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  });

                  return (
                    <div
                      key={day}
                      style={{
                        background: isToday ? '#E8F4E9' : '#F8FAF8',
                        border: isToday ? '2px solid #05620C' : '1px solid #E8F4E9',
                        borderRadius: '10px',
                        padding: '12px',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '8px',
                          paddingBottom: '8px',
                          borderBottom: '1px solid #E8F4E9',
                        }}
                      >
                        <span
                          style={{
                            fontSize: '13px',
                            fontWeight: '600',
                            color: isToday ? '#05620C' : '#1F2937',
                          }}
                        >
                          {dayLabel}
                        </span>
                        {isToday && (
                          <span
                            style={{
                              fontSize: '10px',
                              fontWeight: '600',
                              color: '#05620C',
                              background: '#D1FAE5',
                              padding: '2px 8px',
                              borderRadius: '10px',
                            }}
                          >
                            Today
                          </span>
                        )}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {events.map((event, idx) => (
                          <div
                            key={idx}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              fontSize: '13px',
                              color: '#1F2937',
                            }}
                          >
                            <span
                              style={{
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                background: '#05620C',
                                flexShrink: 0,
                              }}
                            />
                            {event}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendar;