import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { expect, test, describe } from 'vitest';
import { JsonViewer } from './JsonViewer.tsx';

describe('JsonViewer', () => {
  test('renders simple data types', () => {
    const { rerender } = render(<JsonViewer data="hello world" />);
    expect(screen.getByText(/"hello world"/)).toBeInTheDocument();

    rerender(<JsonViewer data={42} />);
    expect(screen.getByText(/42/)).toBeInTheDocument();

    rerender(<JsonViewer data={true} />);
    expect(screen.getByText(/true/)).toBeInTheDocument();

    rerender(<JsonViewer data={false} />);
    expect(screen.getByText(/false/)).toBeInTheDocument();

    rerender(<JsonViewer data={null} />);
    expect(screen.getByText(/null/)).toBeInTheDocument();
  });

  test('renders nested array data and handles expansion', async () => {
    const data = ['item1', 'item2'];
    const { container } = render(<JsonViewer data={data} />);

    // items should be visible initially because default isExpanded=true
    expect(screen.getByText(/"item1"/)).toBeInTheDocument();
    expect(screen.getByText(/"item2"/)).toBeInTheDocument();

    // Find the toggle (container with ChevronDown)
    // we query by finding the svg element for ChevronDown or ChevronRight
    const toggleElement = container.querySelector('.lucide-chevron-down')?.parentElement;
    expect(toggleElement).not.toBeNull();

    // Click to collapse
    fireEvent.click(toggleElement!);

    // items shouldn't be visible or might be animating out
    await waitFor(() => {
        expect(screen.queryByText(/"item1"/)).not.toBeInTheDocument();
    });

    // Check for collapsed text
    expect(screen.getByText(/\.\.\. 2 items/)).toBeInTheDocument();

    // Click to expand again
    fireEvent.click(toggleElement!);
    await waitFor(() => {
        expect(screen.getByText(/"item1"/)).toBeInTheDocument();
    });
  });

  test('renders nested object data and handles expansion', async () => {
    const data = {
      user: {
        name: 'Alice',
        age: 30
      }
    };
    const { container } = render(<JsonViewer data={data} />);

    expect(screen.getByText(/"Alice"/)).toBeInTheDocument();
    expect(screen.getByText(/30/)).toBeInTheDocument();

    // The inner object toggle
    const chevronDowns = container.querySelectorAll('.lucide-chevron-down');
    expect(chevronDowns.length).toBeGreaterThan(0);
    const innerToggle = chevronDowns[chevronDowns.length - 1].parentElement;
    expect(innerToggle).not.toBeNull();

    // Collapse the inner object (user)
    fireEvent.click(innerToggle!);

    await waitFor(() => {
        expect(screen.queryByText(/"Alice"/)).not.toBeInTheDocument();
    });

    expect(screen.getByText(/\.\.\. 2 keys/)).toBeInTheDocument();
  });

  test('renders custom location map links', () => {
    const data = {
      location: 'New York',
      place: 'Paris, France',
      city: 'London',
      country: 'Japan',
      other: 'Not A Location'
    };
    render(<JsonViewer data={data} />);

    // Should render links for location keys
    const mapLinks = document.querySelectorAll('a');
    expect(mapLinks.length).toBe(4);

    expect(mapLinks[0].href).toContain('New%20York');
    expect(mapLinks[1].href).toContain('Paris%2C%20France');
    expect(mapLinks[2].href).toContain('London');
    expect(mapLinks[3].href).toContain('Japan');

    // the "other" value shouldn't have a map link next to it, only a span text
    expect(screen.getByText(/"Not A Location"/)).toBeInTheDocument();
  });
});
