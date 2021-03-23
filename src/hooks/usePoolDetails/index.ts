import { MockPools } from "config/constants";
import { useIsMountedRef } from "hooks/useIsMountedRef";
import { useEffect, useState } from "react";
import { IPool } from "types";
import { waitSeconds } from "utils";

interface IState {
  pool?: IPool;
  loading: boolean;
}

export const usePoolDetails = (
  id: string,
  networkId: number,
  provider: any
): IState & {
  load: () => Promise<void>;
} => {
  const [state, setState] = useState<IState>({
    loading: false,
  });

  const isMountedRef = useIsMountedRef();

  const loadPoolDetails = async () => {
    if (!id) {
      setState(() => ({ loading: false }));
      return;
    }
    setState(() => ({ loading: true }));
    try {
      await waitSeconds(0.5);
      if (isMountedRef.current === true)
        setState(() => ({ loading: false, pool: MockPools[0] }));
    } catch (error) {
      if (isMountedRef.current === true) setState(() => ({ loading: false }));
    }
  };

  useEffect(() => {
    loadPoolDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, networkId, provider]);

  return { ...state, load: loadPoolDetails };
};
