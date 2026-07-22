import { Composition } from "remotion";
import { VoiceLayerHero, VoiceLayerMakingOf } from "./VoiceLayerShowcase";
import {
  DEMO_FPS,
  DEMO_HEIGHT,
  DEMO_WIDTH,
  HERO_DURATION_FRAMES,
  MAKING_OF_DURATION_FRAMES,
} from "./model";

export const VoiceLayerRemotionRoot = () => (
  <>
    <Composition
      id="VoiceLayerHero"
      component={VoiceLayerHero}
      durationInFrames={HERO_DURATION_FRAMES}
      fps={DEMO_FPS}
      width={DEMO_WIDTH}
      height={DEMO_HEIGHT}
    />
    <Composition
      id="VoiceLayerMakingOf"
      component={VoiceLayerMakingOf}
      durationInFrames={MAKING_OF_DURATION_FRAMES}
      fps={DEMO_FPS}
      width={DEMO_WIDTH}
      height={DEMO_HEIGHT}
    />
  </>
);
