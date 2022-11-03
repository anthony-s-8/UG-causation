import numpy as np

## Define some constants for simulation
N = 100000   # number of simulations
pC = 0.25    # probability of C
pA = 0.8     # probability of A

def rand_bool(N, p):
    """Simulate a numpy array of N booleans with probability p"""
    return np.random.rand(N) < p

def collider(N, pC, pA, C=None, A=None, E=np.logical_and):
    """
    Simulate from a collider causal structure where C and A affect E.
    Interventions can be done by using the named arguments:
      C: a numpy array of N booleans
      A: a numpy array of N booleans
      E: either a function of C and A (logical_and by default), or a numpy array of N booleans 
    """
    if C is None:
        C = rand_bool(N, pC)

    if A is None:
        A = rand_bool(N, pA)
    
    if callable(E):
        E = E(C, A)
    return (C, A, E)


## Effect of C on E
# Conditional probability: P(E | C) = p(A)
C, A, E = collider(N, pC, pA)
E[C].mean()

# Interventional probability P(E | do(C)) = p(A)
C, A, E = collider(N, pC, pA, C=np.full(N, True))
E[C].mean()                                     


## Effect of E on C
# Conditional probability P(C | E) = 1
C, A, E = collider(N, pC, pA)
C[E].mean()

# Interventional probability P(C | do(E)) = p(C)
C, A, E = collider(N, pC, pA, E=np.full(N, True))
C[E].mean()



## Necessity Strength (P(-E | do(-C))

# fill in some code here...


## Sufficiency Strength (P(E | do(C)))

# fill in some code here...

## Causal Judgments (weighted average of necessity/sufficiency)

# fill in some code here...
