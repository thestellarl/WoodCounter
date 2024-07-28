'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Stream {
  id: string;
  name: string;
  // Add other stream properties
}

const Page = ({ params }: { params: { slug: string } }) => {
  const router = useRouter();

  const { slug: id } = params;
  const [stream, setStream] = useState<Stream | null>(null);

  useEffect(() => {
    if (id) {
      fetchStreamData(id as string);
    }
  }, [id]);

  const fetchStreamData = async (streamId: string) => {
    try {
      const response = await fetch(`/api/streams/${streamId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch stream data');
      }
      const data = await response.json();
      setStream(data);
    } catch (error) {
      console.error('Error fetching stream data:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  if (!stream) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{stream.name}</h1>
      {/* Add more stream information and stats here */}
    </div>
  );
};

export default Page;
