import React from 'react';
import {
  Facebook,
  Instagram,
  Linkedin,
  SquareArrowOutUpRight,
  Twitter,
  Youtube,
} from 'lucide-react';

export default function ShowSocialMediaLink({ social }) {
  const icons = [
    {
      title: 'facebook',
      icon: Facebook,
      color: '#1877F2', // Facebook Blue
    },
    {
      title: 'instagram',
      icon: Instagram,
      color: '#E4405F', // Instagram Pink
    },
    {
      title: 'linkedin',
      icon: Linkedin,
      color: '#0077B5', // LinkedIn Blue
    },
    {
      title: 'youtube',
      icon: Youtube,
      color: '#FF0000', // YouTube Red
    },
    {
      title: 'twitter',
      icon: Twitter,
      color: '#1DA1F2', // Twitter Blue
    },
    {
      title: 'tiktok',
    },
  ];
  return (
    social &&
    Object.keys(social).map((key) => {
      const value = social[key];
      if (!value) return null; // Skip if value doesn't exist
      const matchedIcon = icons?.find(
        (item) => item?.title?.toLowerCase() === key.toLowerCase()
      );
      return (
        matchedIcon && ( // Ensure matchedIcon exists
          <a
            key={key}
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            title={key}
          >
            {matchedIcon?.icon ? (
              <matchedIcon.icon
                style={{
                  height: '16px',
                  width: '16px',
                  stroke: matchedIcon.color.replace(/'/g, ''),
                }}
              />
            ) : (
              <SquareArrowOutUpRight className={`size-4`} />
            )}
          </a>
        )
      );
    })
  );
}
