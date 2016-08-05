"use strict";

var synaptic = require('synaptic');

class SynapticWrapper {
  constructor() {
    this.neuron = synaptic.Neuron;
    this.layer = synaptic.Layer;
    this.network = synaptic.Network;
    this.trainer = synaptic.Trainer;
    this.architect = synaptic.Architect;
  }
}

exports.SynapticWrapper = SynapticWrapper;
