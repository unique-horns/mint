import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
import i1 from "./assets/images/1.png";

export const StyledButton = styled.button`
  padding: 10px;
  border-radius: 50px;
  border: none;
  background-color: #ffffff;
  padding: 10px;
  font-weight: bold;
  color: #000000;
  width: 300px;
  cursor: pointer;
  box-shadow: 2px 8px 4px -2px rgba(250, 250, 0, 0.5);
  -webkit-box-shadow: 2px 3px 10px -2px rgba(250, 250, 0, 0.5);
  -moz-box-shadow: 2px 8px 4px -2px rgba(250, 250, 0, 0.5);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
  :hover {
    -webkit-box-shadow: 2px 3px 40px -2px rgba(250, 250, 0, 0.9);
  }
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 100%;
  @media (min-width: 767px) {
    flex-direction: column;
  }
`;

export const StyledImg = styled.img`
  width: 200px;
  height: 200px;
  @media (min-width: 767px) {
    width: 300px;
    height: 300px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [feedback, setFeedback] = useState("❤️");
  const [claimingNft, setClaimingNft] = useState(false);

  const claimNFTs = (_amount) => {
    if (_amount <= 0) {
      return;
    }
    setFeedback("Preparing your 🦄...");
    setClaimingNft(true);
    blockchain.smartContract.methods
      .mint(blockchain.account, _amount)
      .send({
        gasLimit: "1000000000",
        to: "0xCd89a2675C30bE71a2Ce06AD4AEF66214Edba2Ed",
        from: blockchain.account,
        value: blockchain.web3.utils.toWei((20 * _amount).toString(), "ether"),
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("It seems the transaction was cancelled.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        setFeedback(
          "Woohoo! You just minted your 🦄! Visit Opensea.io to view your NFT!"
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  return (
    <s.Screen style={{ backgroundColor: "var(--black)" }}>
      <s.Container flex={1} ai={"center"} style={{ padding: 12 }}>
        <s.TextTitle
          style={{ textAlign: "center", fontSize: 36, fontWeight: "bold" }}
        >
          🦄 UniqueHorn NFT Minting 🦄
          
        </s.TextTitle>
        <s.SpacerMedium />
        <ResponsiveWrapper flex={1} style={{ padding: 12 }}>
          <s.Container flex={1} jc={"center"} ai={"center"}>
            <StyledImg alt={"example"} src={i1} />
            <s.SpacerMedium />
            <s.TextTitle
              style={{ textAlign: "center", fontSize: 26, fontWeight: "bold" }}
            >
              Already minted: {data.totalSupply}/10000
            </s.TextTitle>
          </s.Container>
          <s.SpacerMedium />
          <s.Container
            flex={1}
            jc={"center"}
            ai={"center"}
            style={{ backgroundColor: "#000000", padding: 12 }}
          >
            {Number(data.totalSupply) == 10000 ? (
              <>
                <s.TextTitle style={{ textAlign: "center" }}>
                  SOLD OUT!
                </s.TextTitle>
                <s.SpacerSmall />
                <s.TextDescription style={{ textAlign: "center" }}>
                  You can still buy and trade 🦄 NFTs on{" "}!
                  <a
                    target={""}
                    href={"https://opensea.io/collection/unique-horns"}
                  >
                    Opensea.io
                  </a>
                </s.TextDescription>
              </>
            ) : (
              <>
                <s.TextTitle style={{ textAlign: "center" }}>
                  1 🦄 NFT costs 20 Matic
                </s.TextTitle>
                <s.SpacerXSmall />
                <s.SpacerLarge />
                <s.SpacerSmall />
                <s.TextDescription style={{ textAlign: "center" }}>
                  {feedback}
                </s.TextDescription>
                <s.SpacerMedium />
                {blockchain.account === "" ||
                blockchain.smartContract === null ? (
                  <s.Container ai={"center"} jc={"center"}>
                    <s.TextDescription style={{ textAlign: "center" }}>
                    
                    </s.TextDescription>
                    <s.SpacerSmall />
                    <StyledButton
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(connect());
                        getData();
                      }}
                    >
                      CONNECT WALLET
                    </StyledButton>
                    {blockchain.errorMsg !== "" ? (
                      <>
                        <s.SpacerSmall />
                        <s.TextDescription style={{ textAlign: "center" }}>
                          {blockchain.errorMsg}
                        </s.TextDescription>
                      </>
                    ) : null}
                  </s.Container>
                ) : (
                  <s.Container ai={"center"} jc={"center"} fd={"row"}>
                    <StyledButton
                      disabled={claimingNft ? 1 : 0}
                      onClick={(e) => {
                        e.preventDefault();
                        claimNFTs(1);
                        getData();
                      }}
                    >
                      {claimingNft ? "Busy..." : "Buy 1 NFT"}

                    </StyledButton>
                    <StyledButton
                      disabled={claimingNft ? 1 : 0}
                      onClick={(e) => {
                        e.preventDefault();
                        claimNFTs(10);
                        getData();
                      }}
                    >
                      {claimingNft ? "Busy..." : "Buy 10 NFTs"}
                    </StyledButton>
                    <StyledButton
                      disabled={claimingNft ? 1 : 0}
                      onClick={(e) => {
                        e.preventDefault();
                        claimNFTs(100);
                        getData();
                      }}
                    >
                      {claimingNft ? "Busy..." : "Buy 100 NFTs"}
                    </StyledButton>
                  </s.Container>
                )}
              </>
            )}
          </s.Container>
        </ResponsiveWrapper>
        <s.SpacerSmall />
        <s.Container jc={"center"} ai={"center"} style={{ width: "70%" }}>
          <s.TextDescription style={{ textAlign: "center", fontSize: 18 }}>
            Once sold out, 10% of all proceeds will go towards wildlife conservation charity!
          </s.TextDescription>
          <s.TextDescription style={{ textAlign: "center", fontSize: 18 }}>
            I will open a poll on twitter to decide which organization receives the donation
          </s.TextDescription>
          <s.SpacerSmall />
        </s.Container>
      </s.Container>
    </s.Screen>
  );
}

export default App;
