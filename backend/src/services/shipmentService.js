export const shipmentService = {
    volumetricWeightKg({ lengthCm, widthCm, heightCm }) {
      return (lengthCm * widthCm * heightCm) / 5000;
    },
    chargeableWeightKg({ weightKg, lengthCm, widthCm, heightCm }) {
      const vol = this.volumetricWeightKg({ lengthCm, widthCm, heightCm });
      return Math.max(weightKg, vol);
    },
  };
  