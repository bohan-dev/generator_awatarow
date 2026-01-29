import React, { useEffect, useMemo, useState, useRef } from 'react';
import { Box, Container, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useCopy } from '../content/CopyProvider';

// DYNAMIC ASSET IMPORT
const backgroundAssets = import.meta.glob('../assets/avatars/Background/*.png', { eager: true, as: 'url' });
const animalAssets = import.meta.glob('../assets/avatars/Animal/*.png', { eager: true, as: 'url' });
const profileAssets = import.meta.glob('../assets/avatars/Profile/*.png', { eager: true, as: 'url' });
const outfitAssets = import.meta.glob('../assets/avatars/Outfit/*.png', { eager: true, as: 'url' });
const headgearAssets = import.meta.glob('../assets/avatars/Headgear/*.png', { eager: true, as: 'url' });
const toolAssets = import.meta.glob('../assets/avatars/Tool/*.png', { eager: true, as: 'url' });
const sidekickAssets = import.meta.glob('../assets/avatars/SideKick/*.png', { eager: true, as: 'url' });

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

// Helper function
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const SlotMachine: React.FC = () => {
  const { copy } = useCopy();
  const [focusedSlotIndex, setFocusedSlotIndex] = useState<number>(0);
  // 6 slots: Background, Animal, Outfit, Headgear, Tool, SideKick
  const [selections, setSelections] = useState<Array<SlotItem | null>>([
    null, null, null, null, null, null
  ]);
  const selectionSectionRef = useRef<HTMLDivElement>(null);

  // Parse assets to items
  // Memoize these to prevent recalc on every render
  const slotData = useMemo(() => {
    // 1. Backgrounds
    const backgrounds: SlotItem[] = Object.keys(backgroundAssets).map(path => {
        const filename = path.split('/').pop()!;
        const id = filename.replace(/^BG\.|^bg\./, '').replace(/\.png$/, '');
        return { id, name: capitalize(id), image: backgroundAssets[path] };
    });

    // 2. Animals
    const animalIds = new Set<string>();
    Object.keys(animalAssets).forEach(path => {
        const filename = path.split('/').pop()!;
        const match = filename.match(/^([^.]+)\.HT/);
        if (match) animalIds.add(match[1]);
    });
    const animals: SlotItem[] = Array.from(animalIds).map(id => {
        const iconPath = Object.keys(profileAssets).find(p => p.includes(`/${id}.head.png`));
        return { 
            id, 
            name: capitalize(id), 
            image: iconPath ? profileAssets[iconPath] : '' 
        };
    }).filter(item => item.image); // Filter out if no icon?

    // 3. Outfits
    const outfits: SlotItem[] = Object.keys(outfitAssets).map(path => {
        const filename = path.split('/').pop()!;
        const id = filename.replace(/\.png$/, '');
        return { id, name: capitalize(id), image: outfitAssets[path] };
    });

    // 4. Headgears
    const headgears: SlotItem[] = Object.keys(headgearAssets).map(path => {
        const filename = path.split('/').pop()!;
        const id = filename.replace(/\.png$/, '');
        return { id, name: capitalize(id), image: headgearAssets[path] };
    });

    // 5. Tools
    const toolIds = new Set<string>();
    Object.keys(toolAssets).forEach(path => {
        const filename = path.split('/').pop()!;
        const id = filename.split('.')[0];
        toolIds.add(id);
    });
    const tools: SlotItem[] = Array.from(toolIds).map(id => {
        // Use any variant as icon
        const iconPath = Object.keys(toolAssets).find(p => p.includes(`/${id}.`));
        return { id, name: capitalize(id), image: iconPath ? toolAssets[iconPath] : '' };
    });

    // 6. SideKicks
    const sidekicks: SlotItem[] = Object.keys(sidekickAssets).map(path => {
        const filename = path.split('/').pop()!;
        const id = filename.split('.')[0];
        return { id, name: capitalize(id), image: sidekickAssets[path] };
    });

    return { backgrounds, animals, outfits, headgears, tools, sidekicks };
  }, []);

  const slotConfigurations = useMemo<SlotConfig[]>(
    () => [
      {
        id: 'background',
        label: copy.SLOT_BACKGROUND_LABEL || 'Tło',
        helper: copy.SLOT_BACKGROUND_HELPER || 'Wybierz tło',
        items: slotData.backgrounds,
      },
      {
        id: 'animal',
        label: copy.SLOT_ANIMAL_LABEL || 'Zwierzę',
        helper: copy.SLOT_ANIMAL_HELPER || 'Wybierz zwierzę',
        items: slotData.animals,
      },
      {
        id: 'outfit',
        label: 'Ubiór', // Hardcoded fallback or new key
        helper: copy.SLOT_HEADWEAR_HELPER || 'Wybierz ubiór', // Reusing helper if appropriate
        items: slotData.outfits,
      },
      {
        id: 'headgear',
        label: 'Nakrycie głowy', 
        helper: 'Wybierz nakrycie głowy',
        items: slotData.headgears,
      },
      {
        id: 'tool',
        label: copy.SLOT_TOOL_LABEL || 'Atrybut',
        helper: copy.SLOT_TOOL_HELPER || 'Wybierz atrybut',
        items: slotData.tools,
      },
      {
        id: 'sidekick',
        label: 'Kompan',
        helper: 'Wybierz kompana',
        items: slotData.sidekicks,
      },
    ],
    [copy, slotData]
  );

  const selectedConfig = useMemo(
    () => slotConfigurations[focusedSlotIndex] ?? slotConfigurations[0],
    [focusedSlotIndex, slotConfigurations]
  );

  useEffect(() => {
    // Only update selections if metadata changes, but try to keep selected IDs
    setSelections((prev) =>
      prev.map((selection, index) => {
        if (!selection) return selection;
        const conf = slotConfigurations[index];
        if (!conf) return selection;
        const updated = conf.items.find((item) => item.id === selection.id);
        return updated ?? selection;
      })
    );
  }, [slotConfigurations]);

  const handleSlotFocus = (index: number) => {
    setFocusedSlotIndex(index);
    setTimeout(() => {
        selectionSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
    // Indices: 0: BG, 1: Animal, 2: Outfit, 3: Headgear, 4: Tool, 5: Sidekick
    const [bgItem, animalItem, outfitItem, headgearItem, toolItem, sidekickItem] = selections;

    // Check completeness
    const isComplete = selections.every(s => s !== null);
    if (!isComplete) {
        return { layers: [] };
    }

    const layers: { src: string, zIndex: number, id: string }[] = [];

    // 1. Background (Z=1)
    if (bgItem) {
        layers.push({ src: bgItem.image, zIndex: 1, id: 'bg' });
    }

    // 2a. Animal Part I (Z=2) matches `*.HT.layers.1.png` OR `*.HT.png`
    if (animalItem) {
        const id = animalItem.id;
        // Check for Layer 1
        const layer1Path = Object.keys(animalAssets).find(p => p.includes(`/${id}.HT.layers.1.png`));
        const singlePath = Object.keys(animalAssets).find(p => p.includes(`/${id}.HT.png`)); // Non-layered
        
        if (layer1Path) {
            layers.push({ src: animalAssets[layer1Path], zIndex: 2, id: 'animal-back' });
        } else if (singlePath) {
            layers.push({ src: animalAssets[singlePath], zIndex: 2, id: 'animal-full' });
        }
    }

    // 3. Outfit (Z=3)
    if (outfitItem) {
        layers.push({ src: outfitItem.image, zIndex: 3, id: 'outfit' });
    }

    // 2b. Animal Part II (Z=4) matches `*.HT.layers.2.png`
    if (animalItem) {
        const id = animalItem.id;
        const layer2Path = Object.keys(animalAssets).find(p => p.includes(`/${id}.HT.layers.2.png`));
        if (layer2Path) {
            layers.push({ src: animalAssets[layer2Path], zIndex: 4, id: 'animal-front' });
        }
    }

    // 4. Headgear (Z=5)
    if (headgearItem) {
        layers.push({ src: headgearItem.image, zIndex: 5, id: 'headgear' });
    }

    // 5. Tool (Z=6) - Depends on Outfit
    if (toolItem && outfitItem) {
        // pattern: toolId.outfitId.png
        // e.g. binder.suit.png
        // Check exact match first
        let toolPath = Object.keys(toolAssets).find(p => {
             const filename = p.split('/').pop()!;
             return filename.startsWith(`${toolItem.id}.${outfitItem.id}.`);
        });
        
        if (!toolPath) {
             // Fallback: try to find any for this tool ID to avoid missing image
             toolPath = Object.keys(toolAssets).find(p => p.includes(`/${toolItem.id}.`));
        }

        if (toolPath) {
             layers.push({ src: toolAssets[toolPath], zIndex: 6, id: 'tool' });
        }
    }

    // 6. SideKick (Z=7)
    if (sidekickItem) {
        layers.push({ src: sidekickItem.image, zIndex: 7, id: 'sidekick' });
    }

    return { layers };
  };

  const { layers } = getAvatarLayers();
  // Don't show anything unless complete (handled by empty layers array from getAvatarLayers)
  const showAvatar = layers.length > 0;

  return (
    <Container maxWidth="md" sx={{ mt: { xs: 1.5, sm: 4 }, mb: { xs: 4, sm: 6 } }}>
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
            width: 300,
            height: 300,
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
          {showAvatar ? (
            <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
               {layers.sort((a,b) => a.zIndex - b.zIndex).map((layer) => (
                 <Box
                   key={layer.id}
                   component="img"
                   src={layer.src}
                   alt={layer.id}
                   sx={{
                     position: 'absolute',
                     top: 0,
                     left: 0,
                     width: '100%',
                     height: '100%',
                     objectFit: 'contain',
                     zIndex: layer.zIndex
                   }}
                 />
               ))}
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h3" sx={{ color: 'rgba(0, 0, 0, 0.2)', fontWeight: 800 }}>
                ?
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(0,0,0,0.5)' }}>
                    Wybierz wszystkie cechy
                </Typography>
            </Box>
          )}
        </Paper>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(3, 1fr)', md: 'repeat(6, 1fr)' }, gap: 1.5 }}>
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
                  minHeight: 80,
                  p: 1
                }}
              >
                {selection ? (
                  <Box
                    component="img"
                    src={selection.image}
                    alt={selection.name}
                    sx={{
                      maxWidth: '100%',
                      maxHeight: '60px',
                      objectFit: 'contain',
                    }}
                  />
                ) : (
                  <Typography variant="h4" sx={{ color: '#0B0B0B', fontWeight: 800 }}>
                    ?
                  </Typography>
                )}
              </SlotDisplay>
              <Typography
                variant="caption"
                sx={{ display:'block', mt: 1, color: 'rgba(255, 215, 0, 0.8)', letterSpacing: 0.5, fontSize: '0.7rem' }}
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
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: { xs: 1, sm: 2 },
            mt: { xs: 2, sm: 3 },
            pt: 1,
            pb: 1,
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
                  flex: '0 0 auto',
                  width: 100,
                  minWidth: 100
                }}
              >
                <Box
                  component="img"
                  src={item.image}
                  alt={item.name}
                  sx={{ width: '100%', maxWidth: 64, height: 'auto' }}
                />
                <Typography variant="subtitle2" sx={{ color: '#FFD700', fontWeight: 600, fontSize: '0.75rem', textAlign: 'center' }}>
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
