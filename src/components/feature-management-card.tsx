
"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from './ui/card';
import { Switch } from './ui/switch';
import { Label } from './ui/label';

interface FeatureManagementCardProps {
  id: string;
  title: string;
  description: string;
}

export default function FeatureManagementCard({ id, title, description }: FeatureManagementCardProps) {
  // In a real application, this state would come from and be saved to your database.
  const [isEnabled, setIsEnabled] = React.useState(true);

  const handleToggle = () => {
    // Here you would typically call a server action to update the feature's status in Firestore.
    setIsEnabled(!isEnabled);
    console.log(`Toggled ${id} to ${!isEnabled}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <div className="flex items-center space-x-2">
          <Switch 
            id={`switch-${id}`} 
            checked={isEnabled} 
            onCheckedChange={handleToggle}
            aria-label={`Toggle ${title}`}
          />
          <Label htmlFor={`switch-${id}`}>{isEnabled ? 'Aktif' : 'Nonaktif'}</Label>
        </div>
      </CardFooter>
    </Card>
  );
}

// Add React to the scope if it's not globally available
import * as React from 'react';
