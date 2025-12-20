import React, { useEffect, useMemo, useState, useRef } from 'react';
import { Box, Container, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useCopy } from '../content/CopyProvider';

import beaverNoBody from '../assets/PV_Pitch_Avatar/avatar_elements/beaver.noBody.png';
import dogNoBody from '../assets/PV_Pitch_Avatar/avatar_elements/dog.noBody.png';
import helmetBody from '../assets/PV_Pitch_Avatar/avatar_elements/helmet.body.png';
import tophatBody from '../assets/PV_Pitch_Avatar/avatar_elements/tophat.body.png';
import helmetBinder from '../assets/PV_Pitch_Avatar/avatar_elements/helmet.binder.png';
import helmetSaw from '../assets/PV_Pitch_Avatar/avatar_elements/helmet.saw.png';
import tophatBinder from '../assets/PV_Pitch_Avatar/avatar_elements/tophat.binder.png';
import tophatSaw from '../assets/PV_Pitch_Avatar/avatar_elements/tophat.saw.png';

interface SlotItem {
  id: string;
  name: string;
  image: string;
}

interface SlotConfig {
  id: string;
  label: string;
  helper: string;
  items: SlotItem[];
}

const SlotDisplay = styled(Paper)(({ theme }) => ({
  backgroundColor: '#FFFFFF',
  borderRadius: 18,
  border: '2px solid rgba(255, 215, 0, 0.35)',
  minHeight: 140,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease, border 0.2s ease',
  cursor: 'pointer',
  padding: theme.spacing(2),
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.35)',
}));

const SelectionCard = styled(Paper)(({ theme }) => ({
  borderRadius: 18,
  padding: theme.spacing(1.5),
  background: 'linear-gradient(180deg, rgba(255, 215, 0, 0.18) 0%, rgba(10, 10, 10, 0.92) 100%)',
  border: '1px solid rgba(255, 215, 0, 0.25)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1.5),
  cursor: 'pointer',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease, border 0.2s ease',
  boxShadow: '0 10px 24px rgba(0, 0, 0, 0.45)',
  flex: '1 1 0',
  minWidth: 0,
}));





const SlotMachine: React.FC = () => {
  const { copy } = useCopy();
  const [focusedSlotIndex, setFocusedSlotIndex] = useState<number>(0);
  const [selections, setSelections] = useState<Array<SlotItem | null>>([
    null,
    null,
    null,
  ]);
  const selectionSectionRef = useRef<HTMLDivElement>(null);

  // Utility function to shuffle an array
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const slotConfigurations = useMemo<SlotConfig[]>(
    () => [
      {
        id: 'animal',
        label: copy.SLOT_ANIMAL_LABEL,
        helper: copy.SLOT_ANIMAL_HELPER,
        items: shuffleArray([
          { id: 'animal-beaver', name: copy.SLOT_ANIMAL_ITEM_BEAVER_NAME, image: beaverNoBody },
          { id: 'animal-dog', name: copy.SLOT_ANIMAL_ITEM_DOG_NAME, image: dogNoBody },
        ]),
      },
      {
        id: 'headwear',
        label: copy.SLOT_HEADWEAR_LABEL,
        helper: copy.SLOT_HEADWEAR_HELPER,
        items: shuffleArray([
          { id: 'headgear-helmet', name: copy.SLOT_HEADWEAR_ITEM_HELMET_NAME, image: helmetBody },
          { id: 'headgear-tophat', name: copy.SLOT_HEADWEAR_ITEM_TOPHAT_NAME, image: tophatBody },
        ]),
      },
      {
        id: 'tool',
        label: copy.SLOT_TOOL_LABEL,
        helper: copy.SLOT_TOOL_HELPER,
        items: shuffleArray([
          { id: 'tool-binder', name: copy.SLOT_TOOL_ITEM_BINDER_NAME, image: helmetBinder },
          { id: 'tool-saw', name: copy.SLOT_TOOL_ITEM_SAW_NAME, image: helmetSaw },
        ]),
      },
    ],
    [copy]
  );

  const selectedConfig = useMemo(
    () => slotConfigurations[focusedSlotIndex] ?? slotConfigurations[0],
    [focusedSlotIndex, slotConfigurations]
  );

  useEffect(() => {
    setSelections((prev) =>
      prev.map((selection) => {
        if (!selection) {
          return selection;
        }

        const updated = slotConfigurations
          .flatMap((slot) => slot.items)
          .find((item) => item.id === selection.id);

        return updated ?? selection;
      })
    );
  }, [slotConfigurations]);

  if (!selectedConfig) {
    return null;
  }

  const handleSlotFocus = (index: number) => {
    setFocusedSlotIndex(index);
    
    // Scroll to the selection section
    setTimeout(() => {
      selectionSectionRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }, 100);
  };

  const handleItemPick = (item: SlotItem) => {
    setSelections((prev) => {
      const next = [...prev];
      next[focusedSlotIndex] = item;
      return next;
    });
  };

  const getAvatarLayers = () => {
    const [animal, headgear, tool] = selections;
    
    let faceLayer = null;
    let bodyLayer = null;
    let toolLayer = null;

    if (animal) {
        faceLayer = animal.id === 'animal-beaver' ? beaverNoBody : dogNoBody;
    }

    if (headgear) {
        bodyLayer = headgear.id === 'headgear-tophat' ? tophatBody : helmetBody;
    }

    if (tool) {
        const isTophat = headgear?.id === 'headgear-tophat';
        if (tool.id === 'tool-binder') {
            toolLayer = isTophat ? tophatBinder : helmetBinder;
        } else if (tool.id === 'tool-saw') {
            toolLayer = isTophat ? tophatSaw : helmetSaw;
        }
    }

    return { faceLayer, bodyLayer, toolLayer };
  };

  const { faceLayer, bodyLayer, toolLayer } = getAvatarLayers();
  const hasAnyLayer = faceLayer || bodyLayer || toolLayer;

  return (
    <Container maxWidth="sm" sx={{ mt: { xs: 1.5, sm: 4 }, mb: { xs: 4, sm: 6 } }}>
      <Box sx={{ textAlign: 'center', mb: { xs: 2.5, sm: 5 } }}>
        <Typography variant="body2" sx={{ color: 'rgba(255, 215, 0, 0.75)', mt: { xs: 0.75, sm: 1.5 } }}>
          {copy.SLOT_DESCRIPTION}
        </Typography>
      </Box>

      {/* Central Avatar Display */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: { xs: 2, sm: 3 }, gap: 2 }}>
        <Paper
          elevation={5}
          sx={{
            width: 250,
            height: 250,
            borderRadius: 3,
            backgroundColor: '#FFFFFF',
            border: '2px solid rgba(255, 215, 0, 0.4)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 12px 32px rgba(255, 215, 0, 0.2)',
            p: 2,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {hasAnyLayer ? (
            <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
               {/* Layering Order: Body (Back) -> Face (Middle) -> Tool (Front) */}
               {bodyLayer && (
                 <Box
                   component="img"
                   src={bodyLayer}
                   alt="Body"
                   sx={{
                     position: 'absolute',
                     top: 0,
                     left: 0,
                     width: '100%',
                     height: '100%',
                     objectFit: 'contain',
                     zIndex: 1
                   }}
                 />
               )}
               {faceLayer && (
                 <Box
                   component="img"
                   src={faceLayer}
                   alt="Face"
                   sx={{
                     position: 'absolute',
                     top: 0,
                     left: 0,
                     width: '100%',
                     height: '100%',
                     objectFit: 'contain',
                     zIndex: 2
                   }}
                 />
               )}
               {toolLayer && (
                 <Box
                   component="img"
                   src={toolLayer}
                   alt="Tool"
                   sx={{
                     position: 'absolute',
                     top: 0,
                     left: 0,
                     width: '100%',
                     height: '100%',
                     objectFit: 'contain',
                     zIndex: 3
                   }}
                 />
               )}
            </Box>
          ) : (
            <Typography variant="h1" sx={{ color: 'rgba(0, 0, 0, 0.2)', fontWeight: 800, fontSize: '4rem' }}>
              ?
            </Typography>
          )}
        </Paper>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 2 }}>
        {slotConfigurations.map((slot, index) => {
          const selection = selections[index];
          const isFocused = focusedSlotIndex === index;

          return (
            <Box key={slot.id} sx={{ textAlign: 'center' }}>
              <SlotDisplay
                elevation={isFocused ? 10 : 3}
                onClick={() => handleSlotFocus(index)}
                sx={{
                  cursor: 'pointer',
                  borderColor: isFocused ? '#FFD700' : 'rgba(255, 215, 0, 0.35)',
                  borderWidth: isFocused ? '3px' : '2px',
                  boxShadow: isFocused
                    ? '0 16px 36px rgba(255, 215, 0, 0.35)'
                    : '0 10px 30px rgba(0, 0, 0, 0.35)',
                  transform: isFocused ? 'translateY(-6px)' : 'none',
                  opacity: 1,
                  minHeight: 100,
                }}
              >
                {selection ? (
                  <Box
                    component="img"
                    src={selection.image}
                    alt={selection.name}
                    sx={{
                      maxWidth: '100%',
                      maxHeight: '80px',
                      objectFit: 'contain',
                    }}
                  />
                ) : (
                  <Typography variant="h2" sx={{ color: '#0B0B0B', fontWeight: 800 }}>
                    ?
                  </Typography>
                )}
              </SlotDisplay>
              <Typography
                variant="subtitle2"
                sx={{ mt: { xs: 0.75, sm: 1.5 }, color: 'rgba(255, 215, 0, 0.8)', letterSpacing: 0.5 }}
              >
                {slot.label}
              </Typography>
            </Box>
          );
        })}
      </Box>

      <Box ref={selectionSectionRef} sx={{ mt: { xs: 3, sm: 5 } }}>
        <Typography
          variant="h6"
          sx={{ color: '#FFD700', fontWeight: 700, textAlign: 'center', letterSpacing: 0.5 }}
        >
          {`${copy.SLOT_PREFIX_CHOOSE} ${selectedConfig.label.toLowerCase()}`}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: 'rgba(255, 215, 0, 0.7)', textAlign: 'center', mt: 0.75 }}
        >
          {selectedConfig.helper}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            gap: { xs: 1, sm: 2 },
            mt: { xs: 2, sm: 3 },
            pt: 1,
            pb: 1,
            px: { xs: 0.5, sm: 1 },
            width: '100%',
          }}
        >
          {selectedConfig.items.map((item) => {
            const isSelected = selections[focusedSlotIndex]?.id === item.id;

            return (
              <SelectionCard
                key={item.id}
                elevation={isSelected ? 8 : 2}
                onClick={() => handleItemPick(item)}
                sx={{
                  borderColor: isSelected ? '#FFD700' : 'rgba(255, 215, 0, 0.25)',
                  borderWidth: isSelected ? '3px' : '1px',
                  boxShadow: isSelected
                    ? '0 16px 36px rgba(255, 215, 0, 0.35)'
                    : '0 12px 28px rgba(0, 0, 0, 0.45)',
                  transform: isSelected ? 'translateY(-6px)' : 'none',
                  pointerEvents: 'auto',
                }}
              >
                <Box
                  component="img"
                  src={item.image}
                  alt={item.name}
                  sx={{ width: '100%', maxWidth: 64, height: 'auto' }}
                />
                <Typography variant="subtitle2" sx={{ color: '#FFD700', fontWeight: 600 }}>
                  {item.name}
                </Typography>
              </SelectionCard>
            );
          })}
        </Box>
      </Box>
    </Container>
  );
};

export default SlotMachine;