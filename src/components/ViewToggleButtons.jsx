import React from 'react';
import PropTypes from 'prop-types';
import { VIEW_TYPES } from '../constants';

const ViewToggleButtons = ({ view, setView }) => (
  <div className="flex items-center gap-2" role="group" aria-label="View toggle">
    <button
      className={`p-2 rounded ${view === VIEW_TYPES.LIST ? 'bg-primary-main text-white' : 'bg-white text-primary-main border border-primary-main'} transition`}
      onClick={() => setView(VIEW_TYPES.LIST)}
      aria-label="List View"
      aria-pressed={view === VIEW_TYPES.LIST}
      type="button"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
    <button
      className={`p-2 rounded ${view === VIEW_TYPES.CARD ? 'bg-primary-main text-white' : 'bg-white text-primary-main border border-primary-main'} transition`}
      onClick={() => setView(VIEW_TYPES.CARD)}
      aria-label="Card View"
      aria-pressed={view === VIEW_TYPES.CARD}
      type="button"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h7v7H4V6zm9 0h7v7h-7V6zM4 17h7v7H4v-7zm9 0h7v7h-7v-7z" />
      </svg>
    </button>
  </div>
);

ViewToggleButtons.propTypes = {
  view: PropTypes.oneOf([VIEW_TYPES.LIST, VIEW_TYPES.CARD]).isRequired,
  setView: PropTypes.func.isRequired
};

export default ViewToggleButtons;
