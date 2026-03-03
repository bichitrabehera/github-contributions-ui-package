import React from 'react';
import { createRoot } from 'react-dom/client';
import { GithubActivity } from 'github-contributions-ui';

const App = () => {
  return (
    <div style={{ padding: 24, width: 800 }}>
      <h1 style={{ marginBottom: 12, fontSize: 18 }}>Playground</h1>
      <GithubActivity username="bichitrabehera"/>
      <div style={{ height: 24 }} />
      <GithubActivity username="octocat" theme="blue" />
    </div>
  );
};

createRoot(document.getElementById('root')!).render(<App />);
