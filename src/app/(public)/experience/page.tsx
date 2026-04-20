import { redirect } from 'next/navigation';

/** Dedicated page kept for legacy links; canonical section lives on About page. */
export default function ExperiencePage() {
  redirect('/about#experience');
}
