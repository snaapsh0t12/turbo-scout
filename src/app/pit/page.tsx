"use client";

import React, { Suspense } from "react"
import { TurboContext } from "../lib/context"
import { Checkbox, SegmentedControl, Table } from "@mantine/core";
import { useRouter, useSearchParams } from "next/navigation";
import { Badge, Button, Fieldset, Group, NumberInput, Select, Stack, Stepper, TextInput, Textarea, Title } from "@mantine/core";
import SEASON_CONFIG from "../season_config.json";

function PitQuestion(props: { category: string, question: any, questionSetter: Function }) {
  const question: any = props.question;

  switch (question.type) {
    case "boolean":
      return <Checkbox label={question.name} style={{ fontWeight: '500' }} labelPosition="left" onChange={(e: any) => props.questionSetter(props.category, question, e.currentTarget.checked)} />
    case "paragraph":
      return <Textarea label={question.name} onChange={(e) => props.questionSetter(props.category, question, e.target.value)} />
    case "text":
      return <TextInput label={question.name} onChange={(e) => props.questionSetter(props.category, question, e.target.value)} />
    case "number":
      if (question.unit) {
        return <NumberInput label={`${question.name} (${question.unit})`} onChange={(e) => props.questionSetter(props.category, question, e)} />
      }
      return <NumberInput label={question.name} onChange={(e) => props.questionSetter(props.category, question, e)} />
    case "select":
      return <Select label={question.name} data={question.choices} onChange={(e) => props.questionSetter(props.category, question, e)} />
    default:
      //TODO: photo input
      return <p>Not supported: {question.type}</p>
  }
}

function PitScoutingMenu(props: { team: any }) {

  const [currentStep, setCurrentStep] = React.useState(0);
  const [collectedData, setCollectedData]: any = React.useState({});



  const questionSetter: Function = (category: string, question: any, value: any) => {
    if(value == undefined || value == null) return;
    const partial: any = {};
    partial[category] = {...collectedData[category]};
    partial[category][question.name] = value;

    //const questionName: string = question.name;
    setCollectedData({
      ...collectedData, 
      ...partial
    });
  };

  return <Stepper active={currentStep} onStepClick={setCurrentStep} orientation="horizontal">
    {Object.entries(SEASON_CONFIG).map(([category, questions]) => <Stepper.Step label={category} key={category}>
      <Stack>
        {questions.map(question => <PitQuestion category={category} question={question} key={question.name} questionSetter={questionSetter} />)}
        <Button onClick={() => setCurrentStep((current) => (current < (Object.keys(SEASON_CONFIG).length) ? current + 1 : current))}>
          {currentStep != Object.keys(SEASON_CONFIG).length - 1 ? <p>Next</p> : <p>Finish</p>}
        </Button>
        <Button onClick={() => { alert(JSON.stringify(collectedData)) }} color="red">
          Show Data (tmp)
        </Button>
      </Stack>
    </Stepper.Step>)}

  </Stepper>
}

function TeamPitScouting(props: { teams: any, team: string | null }) {
  //TODO: validate team param

  const team = props.teams?.find((team: any) => team['key'] == `frc${props.team}`);

  if (team == undefined) {
    return <p>This team is not loaded!</p>;
  }

  return <Stack align='center'>
    <Group>
      <Title order={2}>{team['key'].substring(3)}: {team['nickname']}</Title>

      {/* TODO: There has to be a more proper way of doing this... */}
      {team['rookie_year'] >= new Date().getFullYear() - 1 ? <Badge color="orange">Rookie</Badge> : (<div></div>)}
    </Group>

    <Fieldset legend="Pit Scouting">
      <PitScoutingMenu team={team} />
    </Fieldset>


  </Stack>;
}

function PitDisplay() {
  const { teams } = React.useContext(TurboContext);


  const queryParams = useSearchParams();
  const router = useRouter();
  const { checkboxState, setCheckboxState } = React.useContext(TurboContext);

  if (queryParams.has("team")) {
    return <TeamPitScouting teams={teams} team={queryParams.get("team")} />
  }

  const isCheckboxSelected = (key: string) => checkboxState!.includes(key);
  const toggleCheckbox = (key: string) => {
    checkboxState!.includes(key)
      ? setCheckboxState!((current: string[]) => current.filter(team => team != key))
      : setCheckboxState!((current: string[]) => [...current, key])
  };

  if (teams == undefined || teams.length == 0) {
    return <p>No teams loaded! Something went wrong!</p>;
  }

  return <Table stickyHeader stickyHeaderOffset={60} withColumnBorders striped>
    <Table.Thead>
      <Table.Tr>
        <Table.Tr></Table.Tr>
        <Table.Td>####</Table.Td>
        <Table.Td>Name</Table.Td>
        <Table.Td>Rookie Year</Table.Td>
      </Table.Tr>
    </Table.Thead>
    <Table.Tbody>
      {teams?.map(team => <Table.Tr key={team['key']}>
        <Table.Td><Checkbox checked={isCheckboxSelected(team['key'])} onChange={() => toggleCheckbox(team['key'])} /></Table.Td>
        <Table.Td onClick={() => router.push(`/pit?team=${team['key'].substring(3)}`)}>{team['key'].substring(3)}</Table.Td>
        <Table.Td onClick={() => router.push(`/pit?team=${team['key'].substring(3)}`)}>{team['nickname']}</Table.Td>
        <Table.Td>{team['rookie_year']}</Table.Td>
      </Table.Tr>)}
    </Table.Tbody>
  </Table>;
}

/**
 * https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout
 */
export default function WrapperElement() {
  return <Suspense><PitDisplay /></Suspense>;
}
